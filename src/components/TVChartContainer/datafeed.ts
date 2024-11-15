const configurationData = {
  // Represents the resolutions for bars supported by your datafeed
  supported_resolutions: [1, 5],
  // The `exchanges` arguments are used for the `searchSymbols` method if a user selects the exchange
  exchanges: [],
  // The `symbols_types` arguments are used for the `searchSymbols` method if a user selects this symbol type
  symbols_types: []
};

export async function makeApiRequest() {
  try {
      const url = new URL(`http://localhost:8080`);
      const response = await fetch(url.toString());
      return response.json();
  } catch (error) {
      throw new Error(`CryptoCompare request error: ${error.status}`);
  }
}

// async function getAllSymbols() {
//   const data = await makeApiRequest('data/v3/all/exchanges');
//   let allSymbols = [];

//   for (const exchange of configurationData.exchanges) {
//       const pairs = data.Data[exchange.value].pairs;

//       for (const leftPairPart of Object.keys(pairs)) {
//           const symbols = pairs[leftPairPart].map(rightPairPart => {
//               const symbol = generateSymbol(exchange.value, leftPairPart, rightPairPart);
//               return {
//                   symbol: symbol.short,
//                   ticker: symbol.short,
//                   description: symbol.short,
//                   exchange: exchange.value,
//                   type: 'crypto',
//               };
//           });
//           allSymbols = [...allSymbols, ...symbols];
//       }
//   }
//   return allSymbols;
// }


const DataFeed = {
  onReady: (callback) => {
    console.log('[onReady]: Method call');
    setTimeout(() => callback(configurationData));
  },
  searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
      console.log('[searchSymbols]: Method call');
  },
  resolveSymbol: async (symbolName, onSymbolResolvedCallback, onResolveErrorCallback, extension) => {
      console.log('[resolveSymbol]: Method call', symbolName);
      const symbolInfo = {
        ticker: 5,
        name: symbolName,
        description: symbolName,
        type: '',
        session: '',
        timezone: '',
        exchange: "",
        minmov: 1,
        pricescale: 100,
        has_intraday: false,
        visible_plots_set: 'ohlc',
        has_weekly_and_monthly: false,
        supported_resolutions: configurationData.supported_resolutions,
        volume_precision: 2,
        data_status: 'streaming',
    };
    onSymbolResolvedCallback(symbolInfo);
  },
  getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
    const { from, to, firstDataRequest } = periodParams;
    console.log('[getBars]: Method call', symbolInfo, resolution, from, to);

    try {
        const data = await makeApiRequest();
        if (data.Response && data.Response === 'Error' || data.Data.length === 0) {
            // "noData" should be set if there is no data in the requested period
            onHistoryCallback([], { noData: true });
            return;
        }
        let bars = [];
        data.Data.forEach(bar => {
            if (bar.time >= from && bar.time < to) {
                bars = [...bars, {
                    time: bar.time * 1000,
                    low: bar.low,
                    high: bar.high,
                    open: bar.open,
                    close: bar.close,
                }];
            }
        });
        console.log(`[getBars]: returned ${bars.length} bar(s)`);
        onHistoryCallback(bars, { noData: false });
    } catch (error) {
        console.log('[getBars]: Get error', error);
        onErrorCallback(error);
    }
  },
  subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) => {
      console.log('[subscribeBars]: Method call with subscriberUID:', subscriberUID);
  },
  unsubscribeBars: (subscriberUID) => {
      console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID);
  },
}

export default DataFeed