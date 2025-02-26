import { AircraftDataPoint } from '@/Interfaces'
import TableComponent from '../../shared/table'

type Props = { aircraftDataset: AircraftDataPoint[] }

const PanelComponent = (props: Props) => {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center">
            {' '}
            <div
                className={`bg-gray-medium bg-opacity-90 border text-center border-gray-200 border-b-none rounded-[16px] w-full h-full`}
            >
                <div className="flex flex-col items-center text-center w-full text-2xl font-medium text-white mt-4 mb-2">
                    Test Information
                </div>
                <div className="overflow-y-auto">
                    <div className="text-center text-white px-1 pb-1 flex-1 overflow-y-auto no-scrollbar">
                        <TableComponent
                            aircraftDataset={props.aircraftDataset}
                        ></TableComponent>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default PanelComponent
