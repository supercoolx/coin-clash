import { HistoryCallback, IBasicDataFeed, LibrarySymbolInfo, PeriodParams, ResolutionString, ResolveCallback } from "../../charting_library/charting_library";
import { BACKEND_URI } from "../../core/constants";

const configurationData = {
  // Represents the resolutions for bars supported by your datafeed
  supports_search: false,
  supported_resolutions: [
    '1' as ResolutionString,
    '5' as ResolutionString,
    '1D' as ResolutionString
    // '60' as ResolutionString,
    // '1D' as ResolutionString,
    // '1W' as ResolutionString,
    // '1M' as ResolutionString,
  ],
  // The `exchanges` arguments are used for the `searchSymbols` method if a user selects the exchange
  // exchanges: [],
  // The `symbols_types` arguments are used for the `searchSymbols` method if a user selects this symbol type
  // symbols_types: []
};

export async function makeApiRequest(tokenMint: string) {
  try {
      const url = new URL(`${BACKEND_URI}/tokens/dataseed/${tokenMint}`);
      const response = await fetch(url.toString());
      return response.json();
  } catch (error) {
      throw new Error(`CryptoCompare request error: ${error.status}`);
  }
}


export default class DataFeed implements IBasicDataFeed {
  private tokenMint: string
  constructor(tokenMint: string) {
    this.tokenMint = tokenMint
  }
  onReady(callback) {
    console.log('[onReady]: Method call');
    setTimeout(() => callback(configurationData));
  }

  async searchSymbols(
    userInput: string,
    exchange: string,
    symbolType: string,
    onResultReadyCallback
  ) {
      console.log('[searchSymbols]: Method call');
  }

  async resolveSymbol(
    symbolName: string,
    onSymbolResolvedCallback: ResolveCallback,
  ) {
      console.log('[resolveSymbol]: Method call', symbolName);
      onSymbolResolvedCallback({
        ticker: symbolName,
        name: symbolName,
        description: symbolName,
        type: 'crypto',
        session: '24x7',
        timezone: 'Etc/UTC',
        exchange: "Coinkick",
        minmov: 1,
        pricescale: 1000000000,
        listed_exchange: 'Coinkick',
        has_intraday: true,
        has_daily: true,
        has_weekly_and_monthly: false,
        visible_plots_set: 'ohlc',
        supported_resolutions: configurationData.supported_resolutions,
        volume_precision: 2,
        data_status: 'streaming',
        format: 'price'
      });
  }
  async getBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    periodParams: PeriodParams,
    onHistoryCallback: HistoryCallback,
  ) {
    try {
      const { from, to } = periodParams;
      console.log('[getBars]: Method call', symbolInfo.name, resolution, from, to);

      if (to === 0){
        onHistoryCallback([], {noData: true})
        return
      }

      const data = await makeApiRequest(this.tokenMint);
      if (!data ||  data.length === 0) {
          // "noData" should be set if there is no data in the requested period
          onHistoryCallback([], { noData: true });
          return;
      }
      let bars: any = [];
      data.forEach(bar => {
          if (bar.timestamp >= from && bar.timestamp < to) {
              bars = [
                ...bars,
                {
                  time: bar.timestamp * 1000,
                  low: bar.low,
                  high: bar.high,
                  open: bar.open,
                  close: bar.close,
              }];
          }
      });
      onHistoryCallback(bars, { noData: false });
    } catch (error) {
        console.log('[getBars]: Get error', error);
        // await this.getBars(symbolInfo, resolution, periodParams, onHistoryCallback)
    }
  }
  subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {
      console.log('[subscribeBars]: Method call with subscriberUID:', subscriberUID);
  }
  unsubscribeBars(subscriberUID) {
      console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID);
  }
}