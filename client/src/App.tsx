import { useEffect, useState } from 'react'
import PanelComponent from './scenes/panel'
import { aircraftData } from '@/data'
import DrawerComponent from '@/scenes/drawer'
import MapComponent from '@/scenes/map'

export default function App() {
    const [screenSmall, setScreenSmall] = useState<boolean>(
        window.matchMedia('(max-width: 1060px)').matches
    )

    useEffect(() => {
        // mobileScreen.matches returns true when window width is less than 1060px.
        const queryScreenIsSmall = window.matchMedia('(max-width: 1060px)')
        function myFunction(e: MediaQueryListEvent) {
            if (typeof e.matches !== 'boolean') {
                console.error(
                    `Error in scenes/drawer/index.ts at line 79: QueryScreenIsSmall has not returned a boolean. Actual type: ${typeof e.matches}.` //TODO add an error log
                )
            }
            if (e.matches) {
                setScreenSmall(true)
            }
            if (!e.matches) {
                setScreenSmall(false)
            }
        }
        queryScreenIsSmall.addEventListener('change', myFunction)
        return () =>
            queryScreenIsSmall.removeEventListener('change', myFunction)
    }, [])

    useEffect(() => {
        const disableZoom = (e: WheelEvent) => {
            if (e.ctrlKey) {
                e.preventDefault()
            }
        }
        const preventTouch = (e: TouchEvent) => {
            e.preventDefault()
        }
        window.addEventListener('wheel', disableZoom, { passive: false })
        window.addEventListener('touchstart', preventTouch, { passive: false })
        window.addEventListener('touchmove', preventTouch, { passive: false })
        return () => {
            window.removeEventListener('wheel', disableZoom)
            window.removeEventListener('touchstart', preventTouch)
            window.removeEventListener('touchmove', preventTouch)
        }
    }, [])

    return (
        <div className="app bg-gray-20">
            <div className="flex flex-1 h-full w-full">
                <div className="container">
                    <MapComponent />
                </div>
                {!screenSmall && (
                    <div className="absolute top-2.5 right-2.5 w-1/3 z-10">
                        <PanelComponent aircraftDataset={aircraftData} />
                    </div>
                )}
                {screenSmall && (
                    <DrawerComponent aircraftDataset={aircraftData} />
                )}
            </div>
        </div>
    )
}
