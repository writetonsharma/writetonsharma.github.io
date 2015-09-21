function createBarChart(whichclass, Chart, Legend, chartTitle, XAxis, YAxis, plotOpt, Navigation, chartSeries) 
{
	$(whichclass).highcharts({
		chart: Chart,
		title: chartTitle,
		xAxis: XAxis,
		yAxis: YAxis,
		legend: Legend,
		tooltip: {
			headerFormat: '<span style="font-size:0.7em;color:#ff0000;">{point.key}</span><table>',
			pointFormat: '<tr><td style="color:{series.color};padding:0;font-size:0.7em;">{series.name}: </td>' +
				'<td style="padding:0;font-size:0.7em;"><b>{point.y:.1f}</b></td></tr>',
			footerFormat: '</table>',
			shared: true,
			useHTML: true
		},
		plotOptions: plotOpt,
		series: chartSeries,
		navigation: Navigation,
		credits: {
			enabled:false
		}
	});
}

function createPieChart(whichclass, Chart, chartTitle, XAxis, YAxis, plotOpt, Navigation, chartSeries) 
{
	$(whichclass).highcharts({
		chart: Chart,
		title: chartTitle,
		xAxis: XAxis,
		yAxis: YAxis,
		tooltip: {
        	    pointFormat: '{series.name}: <b>{point.y}</b>',
            	valueDecimals: 1
		},
		plotOptions: plotOpt,
		series: chartSeries,
		navigation: Navigation,
		credits: {
			enabled:false
		}
	});
}