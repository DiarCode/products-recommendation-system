'use client'

import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Suspense, useCallback, useMemo, useState } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { useAnalyticsSalesByPeriod } from '../hooks/use-sales-by-period.hook'
import {
	FORMATTED_SALES_PERIODS,
	SALES_PERIODS
} from '../models/admin-analytics-dto.types'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/core/components/ui/card'
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent
} from '@/core/components/ui/chart'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue
} from '@/core/components/ui/select'
import { Skeleton } from '@/core/components/ui/skeleton'

const chartConfig = {
	sales: {
		label: 'Sales',
		color: 'hsl(var(--primary))'
	}
} satisfies ChartConfig

export function AdminSalesLineChart() {
	const [selectedPeriodType, setSelectedPeriodType] = useState<SALES_PERIODS>(
		SALES_PERIODS.ONE_MONTH
	)

	const { data: chartData } = useAnalyticsSalesByPeriod(selectedPeriodType)

	const onPeriodTypeChange = useCallback((v: SALES_PERIODS) => {
		setSelectedPeriodType(v)
	}, [])

	const onTickFormat = useCallback(
		(v: string) => {
			const date = parseISO(v)

			switch (selectedPeriodType) {
				case SALES_PERIODS.ONE_DAY:
					return format(date, 'HH:mm', { locale: ru })
				case SALES_PERIODS.FIVE_DAYS:
				case SALES_PERIODS.ONE_MONTH:
					return format(date, 'do MMM', { locale: ru })
				case SALES_PERIODS.SIX_MONTHS:
					return format(date, 'MMM yyyy', { locale: ru })
				case SALES_PERIODS.MAX:
					return format(date, 'yyyy', { locale: ru })
				default:
					return v
			}
		},
		[selectedPeriodType]
	)

	const renderedOptions = useMemo(() => {
		return FORMATTED_SALES_PERIODS.map(type => (
			<SelectItem
				key={type.value}
				value={type.value}
			>
				{type.label}
			</SelectItem>
		))
	}, [])

	return (
		<Suspense fallback={<Skeleton className='h-full w-full rounded-2xl' />}>
			<Card className='shadow-none'>
				<CardHeader>
					<div className='flex items-center justify-between gap-4'>
						<div className='space-y-2'>
							<CardTitle className='text-lg'>Выручка по периодам</CardTitle>

							<CardDescription>
								Показывает выручку от заказов за выбранные периоды
							</CardDescription>
						</div>

						<Select
							value={selectedPeriodType}
							onValueChange={onPeriodTypeChange}
						>
							<SelectTrigger className='w-fit border border-slate-300 bg-transparent'>
								<SelectValue placeholder='Выберите период' />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Выберите период</SelectLabel>
									{renderedOptions}
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
				</CardHeader>
				<CardContent>
					<ChartContainer
						config={chartConfig}
						className='mt-5 min-h-full w-full'
					>
						<AreaChart
							accessibilityLayer
							data={chartData}
							margin={{
								left: 12,
								right: 12
							}}
						>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey='label'
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								minTickGap={100}
								tickFormatter={onTickFormat}
							/>

							<YAxis
								dataKey='value'
								tickLine={false}
								axisLine={false}
								tickCount={4}
							/>

							<ChartTooltip
								cursor={false}
								content={<ChartTooltipContent labelFormatter={onTickFormat} />}
							/>
							<defs>
								<linearGradient
									id='fillSales'
									x1='0'
									y1='0'
									x2='0'
									y2='1'
								>
									<stop
										offset='5%'
										stopColor='var(--color-sales)'
										stopOpacity={0.8}
									/>
									<stop
										offset='95%'
										stopColor='var(--color-sales)'
										stopOpacity={0.1}
									/>
								</linearGradient>
							</defs>

							<Area
								dataKey='value'
								type='bump'
								fill='url(#fillSales)'
								fillOpacity={0.4}
								stroke='var(--color-sales)'
								stackId='a'
								dot={{
									fill: 'var(--color-sales)'
								}}
								activeDot={{
									r: 6
								}}
							/>
						</AreaChart>
					</ChartContainer>
				</CardContent>
			</Card>
		</Suspense>
	)
}
