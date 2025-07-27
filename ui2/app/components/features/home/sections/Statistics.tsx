import { Divide, Nfc, Percent } from "lucide-react";
import Selector from "~/components/common/Selector";
import { stats, metrics, strategies, strategyData } from "../data/strategies";
import AreaChartRE from "~/components/common/charts/AreaChartRE";
import { useEffect, useState } from "react";
import { sleep } from "~/lib/utils";

interface Filters {
    metric: null | string;
    strategy: null | string;
    metricProps: null | {
        id: number;
        option: string;
        value: string;
        default: boolean;
        rechartValue: string;
    };
    strategyProps: null | {
        id: number;
        option: string;
        value: string;
        default: boolean;
    }
}

const Statistics = () => {
    const [loadingChart, setLoadingChart] = useState<boolean>(false);
    const [filteredData, setFilteredData] = useState<Array<object>>([]);
    const [filtersSelected, setFiltersSelected] = useState<Filters>({
        metric: null,
        strategy: null,
        metricProps: null,
        strategyProps: null,
    });

    useEffect(() => {
        const strategySelected = strategies.filter(
            (strategy) => strategy.default === true,
        )[0];
        const metricSelected = metrics.filter(
            (metrics) => metrics.default === true,
        )[0];

        setFiltersSelected({
            metric: metricSelected.option,
            strategy: strategySelected.option,
            metricProps: metricSelected,
            strategyProps: strategySelected,
        });

        const data = strategyData.filter((strat) => {
            return strat.strategy === strategySelected.value;
        })[0];
        setFilteredData(data.data);
    }, []);

    // ------ TESTING --------
    // useEffect(() => {
    //   console.log(filtersSelected);
    // }, [filtersSelected]);

    const handleStrategySelected = async (val: string) => {
        const strategySelected = strategies.filter(
            (strategy) => strategy.value === val,
        )[0];

        setFiltersSelected((prevState: any) => {
            return {
                ...prevState,
                ["strategy"]: strategySelected.option,
                ["strategyProps"]: strategySelected,
            };
        });

        setLoadingChart(true);
        const data = strategyData.filter((strat) => {
            return strat.strategy === strategySelected.value;
        })[0];
        setFilteredData(data.data);
        await sleep(500);
        setLoadingChart(false);
    };
    const handleMetricSelected = async (val: string) => {
        const metricSelected = metrics.filter((metric) => metric.value === val)[0];

        setFiltersSelected((prevState: any) => {
            return {
                ...prevState,
                ["metric"]: metricSelected.option,
                ["metricProps"]: metricSelected,
            };
        });

        setLoadingChart(true);
        const data = strategyData.filter((strat) => {
            return strat.strategy === filtersSelected?.strategyProps?.value;
        })[0];
        setFilteredData(data.data);
        await sleep(500);
        setLoadingChart(false);
    };

    return (
        <div>
            <p className="text-4xl font-semibold max-w-[1240px] mx-auto mt-16">
                Stats
            </p>
            <div className="grid md:grid-cols-3 gap-5 max-w-[1240px] mt-[100px] mb-[100px] mx-auto">
                <div className="metric shadow-lg rounded-md px-4 py-8 flex flex-row justify-evenly items-center">
                    <Nfc size="2.7em" className="bg-[#2176ff] text-white rounded-md p-3" />

                    <p className="text-2xl text-blue-600 font-light">
                        {stats.num_of_symbols} <span>Symbols</span>
                    </p>
                </div>
                <div className="metric shadow-lg rounded-md px-4 py-5 flex flex-row justify-evenly items-center">
                    <Divide size="2.7em" className="bg-[#2176ff] text-white rounded-md p-3" />

                    <p className="text-2xl text-blue-600 font-light">
                        {stats.sharpe_ratio} <span>Sharpe Ratio</span>
                    </p>
                </div>
                <div className="metric shadow-md rounded-md px-4 py-5 flex flex-row justify-evenly items-center">
                    <Percent size="2.7em" className="bg-[#2176ff] text-white rounded-md p-3" />
                    <p className="text-2xl text-blue-600 font-light">
                        {stats.avg_return}% <span> Avg. Return</span>
                    </p>
                </div>
            </div>
            <div className="p-8 shadow-md rounded-md max-w-[1240px] mx-auto mt-[50px]">
                <p className="text-gray-500 font-bold text-md">Choose Strategy</p>
                <Selector
                    label={null}
                    options={strategies}
                    handleSelected={handleStrategySelected}
                />
                <p className="text-gray-500 font-bold text-md mt-3">Choose Metric</p>
                <Selector
                    label={null}
                    options={metrics}
                    handleSelected={handleMetricSelected}
                />
                <div className="mt-[50px]">
                    <AreaChartRE
                        title={`${filtersSelected.strategy}: ${filtersSelected.metric}`}
                        loading={loadingChart}
                        data={filteredData}
                        xDataKey="label"
                        yDataKey={filtersSelected?.metricProps?.rechartValue}
                    />
                </div>
            </div>
        </div>
    );
};

export default Statistics;
