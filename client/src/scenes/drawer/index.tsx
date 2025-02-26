import { useState } from 'react'
import { Drawer } from 'vaul'
import TableComponent from '../../shared/table'
import { AircraftDataPoint } from '@/Interfaces'

type Props = { aircraftDataset: AircraftDataPoint[] }

export default function DrawerComponent(props: Props) {
    const snapPoints = [
        '64px',
        `${props.aircraftDataset.length <= 5 ? props.aircraftDataset.length * 32 + 64 : 5.5 * 32 + 64}px`,
    ]
    const [snap, setSnap] = useState<number | string | null>(snapPoints[0])

    return (
        <Drawer.Root
            snapPoints={snapPoints}
            activeSnapPoint={snap}
            setActiveSnapPoint={setSnap}
            dismissible={false}
            open={true}
            handleOnly={true}
            direction={'bottom'}
        >
            <Drawer.Portal>
                <Drawer.Content className="fixed flex flex-col bg-gray-medium border text-center border-gray-200 border-b-none rounded-t-[16px] bottom-0 left-0 right-0 h-full my-[+1px] mx-[-1px] z-10">
                    <Drawer.Handle className="relative flex flex-col bg-transparent w-full h-16 z-20"></Drawer.Handle>
                    <div className="absolute flex flex-col items-center w-full pt-2 pb-1 mb-0">
                        <div className="w-12 h-1 bg-gray-bright rounded-full"></div>
                    </div>
                    <Drawer.Title className="absolute flex flex-col items-center text-center w-full text-2xl font-medium text-white mt-4">
                        Test Information
                    </Drawer.Title>
                    <div className="overflow-y-auto">
                        <div className="table-container text-center text-white px-2 h-44 flex-1 overflow-y-auto no-scrollbar">
                            <TableComponent
                                aircraftDataset={props.aircraftDataset}
                            ></TableComponent>
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    )
}
