'use strict';
var sendTxCtrl = function($scope, $sce, walletService) {
  $scope.ajaxReq = ajaxReq;
  $scope.unitReadable = ajaxReq.type;
  $scope.sendTxModal = new Modal(document.getElementById('sendTransaction'));
  walletService.wallet = null;
  walletService.password = '';
  $scope.showAdvance = $scope.showRaw = false;
  $scope.dropdownEnabled = true;
  $scope.Validator = Validator;
  $scope.gasLimitChanged = false;
  // Tokens
  $scope.tokenVisibility = 'hidden';
  $scope.tokenTx = {
    to: '',
    value: 0,
    id: -1
  };
  $scope.customGasMsg = '';

  // For token sale holders:
  // 1. Add the address users are sending to
  // 2. Add the gas limit users should use to send successfully (this avoids OOG errors)
  // 3. Add any data if applicable
  // 4. Add a message if you want.

  $scope.tx = {
    // if there is no gasLimit or gas key in the URI, use the default value. Otherwise use value of gas or gasLimit. gasLimit wins over gas if both present
    gasLimit:
      globalFuncs.urlGet('gaslimit') != null ||
      globalFuncs.urlGet('gas') != null
        ? globalFuncs.urlGet('gaslimit') != null
          ? globalFuncs.urlGet('gaslimit')
          : globalFuncs.urlGet('gas')
        : globalFuncs.defaultTxGasLimit,
    data: globalFuncs.urlGet('data') == null ? '' : globalFuncs.urlGet('data'),
    to: globalFuncs.urlGet('to') == null ? '' : globalFuncs.urlGet('to'),
    unit: 'ether',
    value:
      globalFuncs.urlGet('value') == null ? '' : globalFuncs.urlGet('value'),
    nonce: null,
    gasPrice: null,
    donate: false,
    tokenSymbol:
      globalFuncs.urlGet('tokenSymbol') == null
        ? false
        : globalFuncs.urlGet('tokenSymbol'),
    readOnly: globalFuncs.urlGet('readOnly') == null ? false : true
  };
  $scope.setSendMode = function(sendMode, tokenId = '', tokenSymbol = '') {
    $scope.tx.sendMode = sendMode;
    $scope.unitReadable = '';
    if (sendMode == 'ether') {
      $scope.unitReadable = ajaxReq.type;
    } else {
      $scope.unitReadable = tokenSymbol;
      $scope.tokenTx.id = tokenId;
    }
    $scope.dropdownAmount = false;
  };
  $scope.setTokenSendMode = function() {
    if ($scope.tx.sendMode == 'token' && !$scope.tx.tokenSymbol) {
      $scope.tx.tokenSymbol = $scope.wallet.tokenObjs[0].symbol;
      $scope.wallet.tokenObjs[0].type = 'custom';
      $scope.setSendMode($scope.tx.sendMode, 0, $scope.tx.tokenSymbol);
    } else if ($scope.tx.tokenSymbol) {
      for (var i = 0; i < $scope.wallet.tokenObjs.length; i++) {
        if (
          $scope.wallet.tokenObjs[i].symbol
            .toLowerCase()
            .indexOf($scope.tx.tokenSymbol.toLowerCase()) !== -1
        ) {
          $scope.wallet.tokenObjs[i].type = 'custom';
          $scope.setSendMode('token', i, $scope.wallet.tokenObjs[i].symbol);
          break;
        } else $scope.tokenTx.id = -1;
      }
    }
    if ($scope.tx.sendMode != 'token') $scope.tokenTx.id = -1;
  };
  var applyScope = function() {
    if (!$scope.$$phase) $scope.$apply();
  };
  var defaultInit = function() {
    globalFuncs.urlGet('sendMode') == null
      ? $scope.setSendMode('ether')
      : $scope.setSendMode(globalFuncs.urlGet('sendMode'));
    $scope.showAdvance =
      globalFuncs.urlGet('gaslimit') != null ||
      globalFuncs.urlGet('gas') != null ||
      globalFuncs.urlGet('data') != null;
    if (
      globalFuncs.urlGet('data') ||
      globalFuncs.urlGet('value') ||
      globalFuncs.urlGet('to') ||
      globalFuncs.urlGet('gaslimit') ||
      globalFuncs.urlGet('sendMode') ||
      globalFuncs.urlGet('gas') ||
      globalFuncs.urlGet('tokenSymbol')
    )
      $scope.hasQueryString = true; // if there is a query string, show an warning at top of page
  };
  $scope.$watch(
    function() {
      if (walletService.wallet == null) return null;
      return walletService.wallet.getAddressString();
    },
    function() {
      if (walletService.wallet == null) return;
      $scope.wallet = walletService.wallet;
      $scope.wd = true;
      $scope.wallet.setBalance(applyScope);
      $scope.wallet.setTokens();
      if ($scope.parentTxConfig) {
        var setTxObj = function() {
          $scope.tx.to = $scope.parentTxConfig.to;
          $scope.tx.value = $scope.parentTxConfig.value;
          $scope.tx.sendMode = $scope.parentTxConfig.sendMode
            ? $scope.parentTxConfig.sendMode
            : 'ether';
          $scope.tx.tokenSymbol = $scope.parentTxConfig.tokenSymbol
            ? $scope.parentTxConfig.tokenSymbol
            : '';
          $scope.tx.readOnly = $scope.parentTxConfig.readOnly
            ? $scope.parentTxConfig.readOnly
            : false;
        };
        $scope.$watch(
          'parentTxConfig',
          function() {
            setTxObj();
          },
          true
        );
      }
      $scope.setTokenSendMode();
      defaultInit();
    }
  );
  $scope.$watch('ajaxReq.key', function() {
    if ($scope.wallet) {
      $scope.setSendMode('ether');
      $scope.wallet.setBalance(applyScope);
      $scope.wallet.setTokens();
    }
  });
  $scope.$watch(
    'tokenTx',
    function() {
      if (
        $scope.wallet &&
        $scope.wallet.tokenObjs !== undefined &&
        $scope.wallet.tokenObjs[$scope.tokenTx.id] !== undefined &&
        $scope.Validator.isValidAddress($scope.tokenTx.to) &&
        $scope.Validator.isPositiveNumber($scope.tokenTx.value)
      ) {
        if ($scope.estimateTimer) clearTimeout($scope.estimateTimer);
        $scope.estimateTimer = setTimeout(function() {
          $scope.estimateGasLimit();
        }, 500);
      }
    },
    true
  );
  $scope.$watch(
    'tx',
    function(newValue, oldValue) {
      $scope.showRaw = false;
      if (
        oldValue.sendMode != newValue.sendMode &&
        newValue.sendMode == 'ether'
      ) {
        $scope.tx.data = '';
        $scope.tx.gasLimit = globalFuncs.defaultTxGasLimit;
      }
      if (
        newValue.gasLimit == oldValue.gasLimit &&
        $scope.wallet &&
        $scope.Validator.isValidAddress($scope.tx.to) &&
        $scope.Validator.isPositiveNumber($scope.tx.value) &&
        $scope.Validator.isValidHex($scope.tx.data) &&
        $scope.tx.sendMode != 'token'
      ) {
        if ($scope.estimateTimer) clearTimeout($scope.estimateTimer);
        $scope.estimateTimer = setTimeout(function() {
          $scope.estimateGasLimit();
        }, 500);
      }
      if ($scope.tx.sendMode == 'token') {
        $scope.tokenTx.to = $scope.tx.to;
        $scope.tokenTx.value = $scope.tx.value;
      }
    },
    true
  );
  $scope.estimateGasLimit = function() {
    $scope.customGasMsg = '';
    if ($scope.gasLimitChanged) return;
    for (var i in $scope.customGas) {
      if ($scope.tx.to.toLowerCase() == $scope.customGas[i].to.toLowerCase()) {
        $scope.showAdvance = $scope.customGas[i].data != '' ? true : false;
        $scope.tx.gasLimit = $scope.customGas[i].gasLimit;
        $scope.tx.data = $scope.customGas[i].data;
        $scope.customGasMsg =
          $scope.customGas[i].msg != '' ? $scope.customGas[i].msg : '';
        return;
      }
    }
    if (globalFuncs.lightMode) {
      $scope.tx.gasLimit = globalFuncs.defaultTokenGasLimit;
      return;
    }
    var estObj = {
      to: $scope.tx.to,
      from: $scope.wallet.getAddressString(),
      value: ethFuncs.sanitizeHex(
        ethFuncs.decimalToHex(etherUnits.toWei($scope.tx.value, $scope.tx.unit))
      )
    };
    if ($scope.tx.data != '')
      estObj.data = ethFuncs.sanitizeHex($scope.tx.data);
    if ($scope.tx.sendMode == 'token') {
      estObj.to = $scope.wallet.tokenObjs[
        $scope.tokenTx.id
      ].getContractAddress();
      estObj.data = $scope.wallet.tokenObjs[$scope.tokenTx.id].getData(
        $scope.tokenTx.to,
        $scope.tokenTx.value
      ).data;
      estObj.value = '0x00';
    }
    ethFuncs.estimateGas(estObj, function(data) {
      uiFuncs.notifier.close();
      if (!data.error) {
        if (data.data == '-1')
          $scope.notifier.danger(globalFuncs.errorMsgs[21]);
        $scope.tx.gasLimit = data.data;
      } else $scope.notifier.danger(data.msg);
    });
  };
  var isEnough = function(valA, valB) {
    return new BigNumber(valA).lte(new BigNumber(valB));
  };
  $scope.hasEnoughBalance = function() {
    if ($scope.wallet.balance == 'loading') return false;
    return isEnough($scope.tx.value, $scope.wallet.balance);
  };
  $scope.generateTx = function() {
    if (!$scope.Validator.isValidAddress($scope.tx.to)) {
      $scope.notifier.danger(globalFuncs.errorMsgs[5]);
      return;
    }
    var txData = uiFuncs.getTxData($scope);
    if ($scope.tx.sendMode == 'token') {
      // if the amount of tokens you are trying to send > tokens you have, throw error
      if (
        !isEnough(
          $scope.tx.value,
          $scope.wallet.tokenObjs[$scope.tokenTx.id].balance
        )
      ) {
        $scope.notifier.danger(globalFuncs.errorMsgs[0]);
        return;
      }
      txData.to = $scope.wallet.tokenObjs[
        $scope.tokenTx.id
      ].getContractAddress();
      txData.data = $scope.wallet.tokenObjs[$scope.tokenTx.id].getData(
        $scope.tokenTx.to,
        $scope.tokenTx.value
      ).data;
      txData.value = '0x00';
    }
    uiFuncs.generateTx(txData, function(rawTx) {
      if (!rawTx.isError) {
        $scope.rawTx = rawTx.rawTx;
        $scope.signedTx = rawTx.signedTx;
        $scope.showRaw = true;
      } else {
        $scope.showRaw = false;
        $scope.notifier.danger(rawTx.error);
      }
      if (!$scope.$$phase) $scope.$apply();
    });
  };
  $scope.sendTx = function() {
    $scope.sendTxModal.close();
    uiFuncs.sendTx($scope.signedTx, function(resp) {
      if (!resp.isError) {
        var bExStr =
          $scope.ajaxReq.type != nodes.nodeTypes.Custom
            ? "<a class='strong' href='" +
              $scope.ajaxReq.blockExplorerTX.replace('[[txHash]]', resp.data) +
              "' class='strong' target='_blank'>View TX</a><br />"
            : '';
        var emailLink =
          '<a class="strong" href="mailto:support@myetherwallet.com?Subject=Issue%20regarding%20my%20TX%20&Body=Hi%20Taylor%2C%20%0A%0AI%20have%20a%20question%20concerning%20my%20transaction.%20%0A%0AI%20was%20attempting%20to%3A%0A-%20Send%20ETH%0A-%20Send%20Tokens%0A-%20Send%20via%20my%20Ledger%0A-%20Send%20via%20my%20TREZOR%0A-%20Send%20via%20the%20offline%20tab%0A%0AFrom%20address%3A%20%0A%0ATo%20address%3A%20%0A%0AUnfortunately%20it%3A%0A-%20Never%20showed%20on%20the%20blockchain%0A-%20Failed%20due%20to%20out%20of%20gas%0A-%20Failed%20for%20another%20reason%0A-%20Never%20showed%20up%20in%20the%20account%20I%20was%20sending%20to%0A%0A%5B%20INSERT%20MORE%20INFORMATION%20HERE%20%5D%0A%0AThank%20you%0A%0A' +
          '%0A%20TO%20' +
          $scope.tx.to +
          '%0A%20FROM%20' +
          $scope.wallet.getAddressString() +
          '%0A%20AMT%20' +
          $scope.tx.value +
          '%0A%20CUR%20' +
          $scope.unitReadable +
          '%0A%20NODE%20TYPE%20' +
          $scope.ajaxReq.type +
          '%0A%20TOKEN%20' +
          $scope.tx.tokenSymbol +
          '%0A%20TOKEN%20TO%20' +
          $scope.tokenTx.to +
          '%0A%20TOKEN%20AMT%20' +
          $scope.tokenTx.value +
          '%0A%20TOKEN%20CUR%20' +
          $scope.unitReadable +
          '%0A%20TX%20' +
          resp.data +
          '" target="_blank">Confused? Email Us.</a>';
        $scope.notifier.success(
          globalFuncs.successMsgs[2] +
            resp.data +
            '<p>' +
            bExStr +
            '</p><p>' +
            emailLink +
            '</p>'
        );
        $scope.wallet.setBalance(applyScope);
        if ($scope.tx.sendMode == 'token')
          $scope.wallet.tokenObjs[$scope.tokenTx.id].setBalance();
      } else {
        $scope.notifier.danger(resp.error);
      }
    });
  };
  $scope.transferAllBalance = function() {
    if ($scope.tx.sendMode != 'token') {
      uiFuncs.transferAllBalance(
        $scope.wallet.getAddressString(),
        $scope.tx.gasLimit,
        function(resp) {
          if (!resp.isError) {
            $scope.tx.unit = resp.unit;
            $scope.tx.value = resp.value;
          } else {
            $scope.showRaw = false;
            $scope.notifier.danger(resp.error);
          }
        }
      );
    } else {
      $scope.tx.value = $scope.wallet.tokenObjs[$scope.tokenTx.id].getBalance();
    }
  };
};
module.exports = sendTxCtrl;
