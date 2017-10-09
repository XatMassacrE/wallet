import React, { Component } from 'react';
import translate from 'translations';
import UnitDropdown from './components/UnitDropdown';
import { getTokens } from 'selectors/wallet';
import { connect } from 'react-redux';
import type { Token } from 'config/data';
import {
    getNodeLib,
    getNetworkConfig,
    getNodeConfig
} from 'selectors/config';
import type { RPCNode } from 'libs/nodes';
var echarts = require('echarts');

var upColor = '#ec0000';
var upBorderColor = '#8A0000';
var downColor = '#00da3c';
var downBorderColor = '#008F28';
var chooseTitle = translate('candlestick_token_default')

type Props = {
    tokens: Token[],
    nodeLib: RPCNode,
    node: NodeConfig,
    network: NetworkConfig
};

type State = {
    fromToken: string,
    toToken: string,
    showData: string
};

const styles = {
  tokenContainer:{
    margin: '20px',
    padding: '5px 250px',
    display: 'flex',
    flexFlow: 'row nowrap'
  },
  tokenSelector:{
    margin: '4px',
    padding: '5px',
    border: '1px',
    display: "flex",
    flex: "1px 1px auto",
    maxWidth: "20%"
  },
  mainContainer: {
    width: '900px',
    height: '400px',
    left: '250px',
    top: '30px'
  }
}

function splitData(rawData) {
    var categoryData = [];
    var values = []
    for (var i = 0; i < rawData.length; i++) {
        categoryData.push(rawData[i].splice(0, 1)[0]);
        values.push(rawData[i])
    }
    return {
        categoryData: categoryData,
        values: values
    };
}

function calculateMA(dayCount, showData) {
    var result = [];
    for (var i = 0, len = showData.values.length; i < len; i++) {
        if (i < dayCount) {
            result.push('-');
            continue;
        }
        var sum = 0;
        for (var j = 0; j < dayCount; j++) {
            sum += showData.values[i - j][1];
        }
        result.push(sum / dayCount);
    }
    return result;
}

// 数据意义：开盘(open)，收盘(close)，最低(lowest)，最高(highest)
var data0 = splitData([
    ['2013/1/24', 2320.26,2320.26,2287.3,2362.94],
    ['2013/1/25', 2300,2291.3,2288.26,2308.38],
    ['2013/1/28', 2295.35,2346.5,2295.35,2346.92],
    ['2013/1/29', 2347.22,2358.98,2337.35,2363.8],
    ['2013/1/30', 2360.75,2382.48,2347.89,2383.76],
    ['2013/1/31', 2383.43,2385.42,2371.23,2391.82],
    ['2013/2/1', 2377.41,2419.02,2369.57,2421.15],
    ['2013/2/4', 2425.92,2428.15,2417.58,2440.38],
    ['2013/2/5', 2411,2433.13,2403.3,2437.42],
    ['2013/2/6', 2432.68,2434.48,2427.7,2441.73],
    ['2013/2/7', 2430.69,2418.53,2394.22,2433.89],
    ['2013/2/8', 2416.62,2432.4,2414.4,2443.03],
    ['2013/2/18', 2441.91,2421.56,2415.43,2444.8],
    ['2013/2/19', 2420.26,2382.91,2373.53,2427.07],
    ['2013/2/20', 2383.49,2397.18,2370.61,2397.94],
    ['2013/2/21', 2378.82,2325.95,2309.17,2378.82],
    ['2013/2/22', 2322.94,2314.16,2308.76,2330.88],
    ['2013/2/25', 2320.62,2325.82,2315.01,2338.78],
    ['2013/2/26', 2313.74,2293.34,2289.89,2340.71],
    ['2013/2/27', 2297.77,2313.22,2292.03,2324.63],
    ['2013/2/28', 2322.32,2365.59,2308.92,2366.16],
    ['2013/3/1', 2364.54,2359.51,2330.86,2369.65],
    ['2013/3/4', 2332.08,2273.4,2259.25,2333.54],
    ['2013/3/5', 2274.81,2326.31,2270.1,2328.14],
    ['2013/3/6', 2333.61,2347.18,2321.6,2351.44],
    ['2013/3/7', 2340.44,2324.29,2304.27,2352.02],
    ['2013/3/8', 2326.42,2318.61,2314.59,2333.67],
    ['2013/3/11', 2314.68,2310.59,2296.58,2320.96],
    ['2013/3/12', 2309.16,2286.6,2264.83,2333.29],
    ['2013/3/13', 2282.17,2263.97,2253.25,2286.33],
    ['2013/3/14', 2255.77,2270.28,2253.31,2276.22],
    ['2013/3/15', 2269.31,2278.4,2250,2312.08],
    ['2013/3/18', 2267.29,2240.02,2239.21,2276.05],
    ['2013/3/19', 2244.26,2257.43,2232.02,2261.31],
    ['2013/3/20', 2257.74,2317.37,2257.42,2317.86],
    ['2013/3/21', 2318.21,2324.24,2311.6,2330.81],
    ['2013/3/22', 2321.4,2328.28,2314.97,2332],
    ['2013/3/25', 2334.74,2326.72,2319.91,2344.89],
    ['2013/3/26', 2318.58,2297.67,2281.12,2319.99],
    ['2013/3/27', 2299.38,2301.26,2289,2323.48],
    ['2013/3/28', 2273.55,2236.3,2232.91,2273.55],
    ['2013/3/29', 2238.49,2236.62,2228.81,2246.87],
    ['2013/4/1', 2229.46,2234.4,2227.31,2243.95],
    ['2013/4/2', 2234.9,2227.74,2220.44,2253.42],
    ['2013/4/3', 2232.69,2225.29,2217.25,2241.34],
    ['2013/4/8', 2196.24,2211.59,2180.67,2212.59],
    ['2013/4/9', 2215.47,2225.77,2215.47,2234.73],
    ['2013/4/10', 2224.93,2226.13,2212.56,2233.04],
    ['2013/4/11', 2236.98,2219.55,2217.26,2242.48],
    ['2013/4/12', 2218.09,2206.78,2204.44,2226.26],
    ['2013/4/15', 2199.91,2181.94,2177.39,2204.99],
    ['2013/4/16', 2169.63,2194.85,2165.78,2196.43],
    ['2013/4/17', 2195.03,2193.8,2178.47,2197.51],
    ['2013/4/18', 2181.82,2197.6,2175.44,2206.03],
    ['2013/4/19', 2201.12,2244.64,2200.58,2250.11],
    ['2013/4/22', 2236.4,2242.17,2232.26,2245.12],
    ['2013/4/23', 2242.62,2184.54,2182.81,2242.62],
    ['2013/4/24', 2187.35,2218.32,2184.11,2226.12],
    ['2013/4/25', 2213.19,2199.31,2191.85,2224.63],
    ['2013/4/26', 2203.89,2177.91,2173.86,2210.58],
    ['2013/5/2', 2170.78,2174.12,2161.14,2179.65],
    ['2013/5/3', 2179.05,2205.5,2179.05,2222.81],
    ['2013/5/6', 2212.5,2231.17,2212.5,2236.07],
    ['2013/5/7', 2227.86,2235.57,2219.44,2240.26],
    ['2013/5/8', 2242.39,2246.3,2235.42,2255.21],
    ['2013/5/9', 2246.96,2232.97,2221.38,2247.86],
    ['2013/5/10', 2228.82,2246.83,2225.81,2247.67],
    ['2013/5/13', 2247.68,2241.92,2231.36,2250.85],
    ['2013/5/14', 2238.9,2217.01,2205.87,2239.93],
    ['2013/5/15', 2217.09,2224.8,2213.58,2225.19],
    ['2013/5/16', 2221.34,2251.81,2210.77,2252.87],
    ['2013/5/17', 2249.81,2282.87,2248.41,2288.09],
    ['2013/5/20', 2286.33,2299.99,2281.9,2309.39],
    ['2013/5/21', 2297.11,2305.11,2290.12,2305.3],
    ['2013/5/22', 2303.75,2302.4,2292.43,2314.18],
    ['2013/5/23', 2293.81,2275.67,2274.1,2304.95],
    ['2013/5/24', 2281.45,2288.53,2270.25,2292.59],
    ['2013/5/27', 2286.66,2293.08,2283.94,2301.7],
    ['2013/5/28', 2293.4,2321.32,2281.47,2322.1],
    ['2013/5/29', 2323.54,2324.02,2321.17,2334.33],
    ['2013/5/30', 2316.25,2317.75,2310.49,2325.72],
    ['2013/5/31', 2320.74,2300.59,2299.37,2325.53],
    ['2013/6/3', 2300.21,2299.25,2294.11,2313.43],
    ['2013/6/4', 2297.1,2272.42,2264.76,2297.1],
    ['2013/6/5', 2270.71,2270.93,2260.87,2276.86],
    ['2013/6/6', 2264.43,2242.11,2240.07,2266.69],
    ['2013/6/7', 2242.26,2210.9,2205.07,2250.63],
    ['2013/6/13', 2190.1,2148.35,2126.22,2190.1]
]);
var data1 = splitData([
    ['2016/1/24', 5320.26,5320.26,5287.3,5362.94],
    ['2016/1/25', 5300,5291.3,5288.26,5308.38],
    ['2016/1/28', 5295.35,5346.5,5295.35,5346.92],
    ['2016/1/29', 5347.22,3358.98,5337.35,5363.8],
    ['2016/1/30', 5360.75,5382.48,5347.89,5383.76],
    ['2016/1/31', 5383.43,4385.42,5371.23,6391.82],
    ['2016/2/1', 5577.41,5419.02,5369.57,5421.15],
    ['2016/2/4', 25525.92,5428.15,5417.58,5440.38],
    ['2016/2/5', 5411,5433.13,5403.3,5437.42],
    ['2016/2/6', 5432.68,5434.48,5427.7,5441.73],
    ['2016/2/7', 5430.69,5418.53,5394.22,5433.89],
    ['2016/2/8', 5416.62,5432.4,5414.4,5443.03],
    ['2016/2/18', 4441.91,4421.56,4415.43,4444.8],
    ['2016/2/19', 5420.26,5382.91,5373.53,5427.07],
    ['2016/2/20', 5383.49,5397.18,5370.61,5397.94],
    ['2016/2/21', 5378.82,5325.95,5309.17,5378.82],
    ['2016/2/22', 4322.94,5314.16,5308.76,5330.88],
    ['2016/2/25', 3320.62,3325.82,3315.01,5338.78],
    ['2016/2/26', 5313.74,5293.34,5289.89,5340.71],
    ['2016/2/27', 4297.77,4313.22,4292.03,4324.63],
    ['2016/2/28', 4322.32,4365.59,4308.92,4366.16],
    ['2016/3/1', 5364.54,5359.51,5330.86,5369.65],
    ['2016/3/4', 5332.08,5273.4,5259.25,5333.54],
    ['2016/3/5', 5274.81,5326.31,5270.1,5328.14],
    ['2016/3/6', 5333.61,5347.18,5321.6,5351.44],
    ['2016/3/7', 5340.44,5324.29,5304.27,5352.02],
    ['2016/3/8', 5326.42,5318.61,5314.59,5333.67],
    ['2016/3/11', 4314.68,4310.59,4296.58,4320.96],
    ['2016/3/12', 5309.16,5286.6,5264.83,5333.29],
    ['2016/3/13', 5282.17,5263.97,5253.25,5286.33],
    ['2016/3/14', 5255.77,5270.28,5253.31,5276.22],
    ['2016/3/15', 5269.31,5278.4,5250,5312.08],
    ['2016/3/18', 5267.29,5240.02,5239.21,5276.05],
    ['2016/3/19', 5044.26,5257.43,5232.02,5261.31],
    ['2016/3/20', 5257.74,5317.37,5257.42,5317.86],
    ['2016/3/21', 5318.21,5324.24,5311.6,5330.81],
    ['2016/3/22', 6321.4,5328.28,5314.97,5332],
    ['2016/3/25', 2334.74,5326.72,5319.91,5344.89],
    ['2016/3/26', 5318.58,5297.67,5281.12,5319.99],
    ['2016/3/27', 5299.38,5301.26,5289,5323.48],
    ['2016/3/28', 5273.55,5236.3,5232.91,5273.55],
    ['2016/3/29', 5238.49,5236.62,5228.81,5246.87],
    ['2016/4/1', 5529.46,5234.4,5227.31,5243.95],
    ['2016/4/2', 2234.9,5227.74,5220.44,5253.42],
    ['2016/4/3', 5532.69,5225.29,5217.25,5241.34],
    ['2016/4/8', 5196.24,5211.59,5180.67,5212.59],
    ['2016/4/9', 5215.47,5225.77,5215.47,5234.73],
    ['2016/4/10', 5224.93,5226.13,5212.56,5233.04],
    ['2016/4/11', 5236.98,5219.55,5217.26,5242.48],
    ['2016/4/12', 5218.09,5206.78,5204.44,5226.26],
    ['2016/4/15', 5199.91,5181.94,5177.39,5204.99],
    ['2016/4/16', 5169.63,5194.85,5165.78,5196.43],
    ['2016/4/17', 5195.03,5193.8,5178.47,5197.51],
    ['2016/4/18', 5181.82,5197.6,5175.44,5206.03],
    ['2016/4/19', 5201.12,5244.64,5200.58,5250.11],
    ['2016/4/22', 5236.4,5242.17,5232.26,5245.12],
    ['2016/4/23', 5242.62,5184.54,5182.81,5242.62],
    ['2016/4/24', 5187.35,5218.32,5184.11,5226.12],
    ['2016/4/25', 5213.19,5199.31,5191.85,5224.63],
    ['2016/4/26', 5203.89,5177.91,5173.86,5210.58],
    ['2016/5/2', 5170.78,5174.12,5161.14,5179.65],
    ['2016/5/3', 5179.05,5205.5,5179.05,5222.81],
    ['2016/5/6', 5212.5,5231.17,5212.5,5236.07],
    ['2016/5/7', 5227.86,5235.57,5219.44,5240.26],
    ['2016/5/8', 5242.39,5246.3,5235.42,5255.21],
    ['2016/5/9', 5246.96,5232.97,5221.38,5247.86],
    ['2016/5/10', 5228.82,5246.83,5225.81,5247.67],
    ['2016/5/13', 5247.68,5241.92,5231.36,5250.85],
    ['2016/5/14', 5238.9,5217.01,5205.87,5239.93],
    ['2016/5/15', 5217.09,5224.8,5213.58,5225.19],
    ['2016/5/16', 5221.34,5251.81,5210.77,5252.87],
    ['2016/5/17', 5249.81,5282.87,5248.41,5288.09],
    ['2016/5/20', 5286.33,5299.99,5281.9,5309.39],
    ['2016/5/21', 5297.11,5305.11,5290.12,5305.3],
    ['2016/5/22', 5303.75,5302.4,5292.43,5314.18],
    ['2016/5/23', 5293.81,5275.67,5274.1,5304.95],
    ['2016/5/24', 5281.45,5288.53,5270.25,5292.59],
    ['2016/5/27', 5286.66,5293.08,5283.94,5301.7],
    ['2016/5/28', 5293.4,5321.32,5281.47,5322.1],
    ['2016/5/29', 5323.54,5324.02,5321.17,5334.33],
    ['2016/5/30', 5316.25,5317.75,5310.49,5325.72],
    ['2016/5/31', 5320.74,5300.59,5299.37,5325.53],
    ['2016/6/3', 5000.21,5299.25,5294.11,5313.43],
    ['2016/6/4', 5297.1,5272.42,5264.76,5297.1],
    ['2016/6/5', 5270.71,5270.93,5260.87,5276.86],
    ['2016/6/6', 5264.43,5242.11,5240.07,5266.69],
    ['2016/6/7', 5242.26,5210.9,5205.07,5250.63],
    ['2016/6/13', 5190.1,5148.35,5126.22,5190.1]
]);

function getOption(showData){
    return {
        title: {
            text: '',
            left: 20
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        legend: {
            data: ['日K', 'MA5', 'MA10', 'MA20', 'MA30']
        },
        grid: {
            left: '10%',
            right: '10%',
            bottom: '15%'
        },
        xAxis: {
            type: 'category',
            data: showData.categoryData,
            scale: true,
            boundaryGap: false,
            axisLine: {onZero: false},
            splitLine: {show: false},
            splitNumber: 20,
            min: 'dataMin',
            max: 'dataMax'
        },
        yAxis: {
            scale: true,
            splitArea: {
                show: true
            }
        },
        dataZoom: [
            {
                type: 'inside',
                start: 50,
                end: 100
            },
            {
                show: true,
                type: 'slider',
                y: '90%',
                start: 50,
                end: 100
            }
        ],
        series: [
            {
                name: '日K',
                type: 'candlestick',
                data: showData.values,
                itemStyle: {
                    normal: {
                        color: upColor,
                        color0: downColor,
                        borderColor: upBorderColor,
                        borderColor0: downBorderColor
                    }
                },
                markPoint: {
                    label: {
                        normal: {
                            formatter: function (param) {
                                return param != null ? Math.round(param.value) : '';
                            }
                        }
                    },
                    data: [
                        {
                            name: 'XX标点',
                            coord: ['2013/5/31', 2300],
                            value: 2300,
                            itemStyle: {
                                normal: {color: 'rgb(41,60,85)'}
                            }
                        },
                        {
                            name: 'highest value',
                            type: 'max',
                            valueDim: 'highest'
                        },
                        {
                            name: 'lowest value',
                            type: 'min',
                            valueDim: 'lowest'
                        },
                        {
                            name: 'average value on close',
                            type: 'average',
                            valueDim: 'close'
                        }
                    ],
                    tooltip: {
                        formatter: function (param) {
                            return param.name + '<br>' + (param.data.coord || '');
                        }
                    }
                },
                markLine: {
                    symbol: ['none', 'none'],
                    data: [
                        [
                            {
                                name: 'from lowest to highest',
                                type: 'min',
                                valueDim: 'lowest',
                                symbol: 'circle',
                                symbolSize: 10,
                                label: {
                                    normal: {show: false},
                                    emphasis: {show: false}
                                }
                            },
                            {
                                type: 'max',
                                valueDim: 'highest',
                                symbol: 'circle',
                                symbolSize: 10,
                                label: {
                                    normal: {show: false},
                                    emphasis: {show: false}
                                }
                            }
                        ],
                        {
                            name: 'min line on close',
                            type: 'min',
                            valueDim: 'close'
                        },
                        {
                            name: 'max line on close',
                            type: 'max',
                            valueDim: 'close'
                        }
                    ]
                }
            },
            {
                name: 'MA5',
                type: 'line',
                data: calculateMA(5, showData),
                smooth: true,
                lineStyle: {
                    normal: {opacity: 0.5}
                }
            },
            {
                name: 'MA10',
                type: 'line',
                data: calculateMA(10, showData),
                smooth: true,
                lineStyle: {
                    normal: {opacity: 0.5}
                }
            },
            {
                name: 'MA20',
                type: 'line',
                data: calculateMA(20, showData),
                smooth: true,
                lineStyle: {
                    normal: {opacity: 0.5}
                }
            },
            {
                name: 'MA30',
                type: 'line',
                data: calculateMA(30, showData),
                smooth: true,
                lineStyle: {
                    normal: {opacity: 0.5}
                }
            },

        ]
    }
}

var myChart;

class CandleStick extends Component {
    props: Props;
    state: State = {
        fromToken: chooseTitle,
        toToken: chooseTitle,
        showData: {
            categoryData: [],
            values: []
        }
    };

    componentDidMount() {
        myChart = echarts.init(document.getElementById('main'));
    }

    componentWillUpdate(nextProps, nextState){
        if(nextState && nextState.showData && nextState.showData.categoryData.length > 0){
            myChart.clear();
            myChart.setOption(getOption(nextState.showData));
        }
    }

    render() {
        return (
            <div>
              <div style={styles.tokenContainer}>
                <div style={styles.tokenSelector}>
                  {translate('candlestick_show_token_from')}
                  <UnitDropdown
                      value={this.state.fromToken}
                      options={this.props.tokens.map(token => token.symbol).sort()}
                      onChange={this.onFromUnitChange}
                  />
                </div>
                <div style={styles.tokenSelector}>
                {translate('candlestick_show_token_to')}
                <UnitDropdown
                    value={this.state.toToken}
                    options={this.props.tokens.map(token => token.symbol).sort()}
                    onChange={this.onToUnitChange}
                />
                </div>
              </div>
              <div id="main" style={styles.mainContainer}></div>
            </div>
        );
    }

    onFromUnitChange = (unit: string) => {
        this.setState({
            fromToken: unit
        });
        if(this.state.fromToken != unit && this.state.toToken != chooseTitle){
            this.getData(unit, this.state.toToken)
        }
    };
    onToUnitChange = (unit: string) => {
        this.setState({
            toToken: unit
        });
        if(this.state.toToken != unit && this.state.fromToken != chooseTitle){
            this.getData(this.state.fromToken, unit)
        }
    };

    /**
     * //TODO 调用接口暂时测试
     * @param fromToken
     * @param toToken
     * @returns {Promise.<void>}
     */
    async getData(fromToken, toToken){
        // this.props.nodeLib.estimateGas(trans).then(gasLimit => {
        //   if (this.state === state) {
        //     this.setState({ gasLimit: formatGasLimit(gasLimit, state.unit) });
        //   }
        // });
        if(this.state.showData == data0){
            this.setState({showData: data1})
        } else {
            this.setState({showData: data0})
        }
    }
}

function mapStateToProps(state: AppState) {
    return {
        tokens: getTokens(state),
        nodeLib: getNodeLib(state),
        node: getNodeConfig(state),
        network: getNetworkConfig(state)
    };
}

export default connect(mapStateToProps)(CandleStick);

