import { useState } from 'react'
import { AircraftDataPoint } from '@/Interfaces'

type Props = {
    aircraftDataset: AircraftDataPoint[]
}

const TableComponent = (props: Props) => {
    const [trackedAircraft, setTrackedAircraft] = useState<string>('')

    return (
        <div>
            <table className="min-w-full w-full">
                <tbody className="">
                    {/* <th> </th> */}
                    {props.aircraftDataset.map((item) => (
                        <tr
                            className={`${item.flightNumber === trackedAircraft && 'bg-white bg-opacity-25'} h-8`}
                            key={item.flightNumber}
                            onClick={() =>
                                setTrackedAircraft(
                                    trackedAircraft === item.flightNumber
                                        ? ''
                                        : item.flightNumber
                                )
                            }
                        >
                            <td className="border-t border-gray-light">
                                {item.company}
                            </td>
                            <td className="border-t border-gray-light">
                                {item.flightNumber}
                            </td>
                            <td className="border-t border-gray-light">
                                {item.route}
                            </td>
                            <td className="border-t border-gray-light">
                                {item.departure}
                            </td>
                            <td className="border-t border-gray-light">
                                {item.arrival}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default TableComponent
