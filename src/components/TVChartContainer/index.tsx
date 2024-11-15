import { useEffect, useRef } from 'react'
import {
	widget,
	ChartingLibraryWidgetOptions,
	LanguageCode,
	ResolutionString,
} from '../../charting_library'
import * as React from 'react'
import Datafeed from './datafeed'

export interface ChartContainerProps {
	symbol: ChartingLibraryWidgetOptions['symbol']
	interval: ChartingLibraryWidgetOptions['interval']

	// BEWARE: no trailing slash is expected in feed URL
	datafeedUrl: string
	libraryPath: ChartingLibraryWidgetOptions['library_path']
	chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url']
	chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version']
	clientId: ChartingLibraryWidgetOptions['client_id']
	userId: ChartingLibraryWidgetOptions['user_id']
	fullscreen: ChartingLibraryWidgetOptions['fullscreen']
	autosize: ChartingLibraryWidgetOptions['autosize']
	studiesOverrides: ChartingLibraryWidgetOptions['studies_overrides']
	container: ChartingLibraryWidgetOptions['container']
	disabled_features: ChartingLibraryWidgetOptions['disabled_features']
}

const getLanguageFromURL = (): LanguageCode | null => {
	const regex = new RegExp('[\\?&]lang=([^&#]*)')
	const results = regex.exec(location.search)
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode
}

export const TVChartContainer = ({tokenInfo}) => {

	const chartContainerRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>

	const defaultProps: Omit<ChartContainerProps, 'container'> = {
		symbol: tokenInfo.symbol,
		interval: '5' as ResolutionString,
		datafeedUrl: '',
		libraryPath: '/charting_library/',
		disabled_features: [
			// 'header_widget',
			// 'header_symbol_search',
			'symbol_search_hot_key',
			'use_localstorage_for_settings',
			'popup_hints'
		],
		chartsStorageUrl: '',
		chartsStorageApiVersion: '1.1',
		clientId: '',
		userId: 'public_user_id',
		fullscreen: false,
		autosize: true,
		studiesOverrides: {},
	}

	useEffect(() => {
		const widgetOptions: ChartingLibraryWidgetOptions = {
			symbol: defaultProps.symbol as string,
			// BEWARE: no trailing slash is expected in feed URL
			// tslint:disable-next-line:no-any
			datafeed: new Datafeed(tokenInfo.mint),
			interval: defaultProps.interval as ChartingLibraryWidgetOptions['interval'],
			container: chartContainerRef.current,
			library_path: defaultProps.libraryPath as string,

			locale: getLanguageFromURL() || 'en',
			disabled_features: defaultProps.disabled_features,
			// enabled_features: ['study_templates'],
			charts_storage_url: defaultProps.chartsStorageUrl,
			charts_storage_api_version: defaultProps.chartsStorageApiVersion,
			client_id: defaultProps.clientId,
			user_id: defaultProps.userId,
			fullscreen: defaultProps.fullscreen,
			autosize: defaultProps.autosize,
			studies_overrides: defaultProps.studiesOverrides,
			theme: 'dark'
		}

		const tvWidget = new widget(widgetOptions)

		tvWidget.onChartReady(() => {
			tvWidget.headerReady().then(() => {
				const button = tvWidget.createButton()
				button.setAttribute('title', 'Click to show a notification popup')
				button.classList.add('apply-common-tooltip')
				button.addEventListener('click', () => tvWidget.showNoticeDialog({
						title: 'Notification',
						body: 'TradingView Charting Library API works correctly',
						callback: () => {
							console.log('Noticed!')
						},
					}))
				button.innerHTML = 'Check API'
			})
		})

		return () => {
			tvWidget.remove()
		}
	},[tokenInfo])

	return (
		<div
			ref={ chartContainerRef }
			className="h-full"
		/>
	)
}
