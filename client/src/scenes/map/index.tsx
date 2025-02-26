import { useRef, useEffect } from 'react'
import p5 from 'p5'
import Circle from './circle'
import Map from './cartography'
import Controls from './controls'

type View = {
    x: number
    y: number
    zoom: number
}
type ViewPos = {
    prevX: number | null
    prevY: number | null
    isDragging: boolean
}
type ControlsType = {
    view: View
    viewPos: ViewPos
}

const disableZoom = (e: WheelEvent) => {
    if (e.ctrlKey) {
        e.preventDefault()
    }
}

const MapComponent = () => {
    const myRef = useRef(null)

    const Sketch = (p: p5) => {
        let window_height: number, window_width: number
        let coastline: Map
        let controls: Controls
        //   let canvas: canvas100
        // let x:number, y:number, xDisplacement:number, yDisplacement:number, xDirection:number, yDirection:number, radius:number;
        // let ball:Circle;

        p.setup = () => {
            p.createCanvas(window.innerWidth, window.innerHeight)
            p.frameRate(60)
            console.log(`inner width ${window.innerWidth}`)
            console.log(`inner height ${window.innerHeight}`)
            p.background(60)
            coastline = new Map(p)
            controls = new Controls(p)

            // Translate controls
            const touchHandlers = Controls.touch(controls.controls)

            // p.mousePressed = (e: MouseEvent) => moveHandlers.mousePressed(e)
            // p.mouseDragged = (e: MouseEvent) => moveHandlers.mouseDragged(e)
            // p.mouseReleased = (e: MouseEvent) => moveHandlers.mouseReleased(e)

            p.touchStarted = (e: TouchEvent) => touchHandlers.touchStarted(e)
            p.touchMoved = (e: TouchEvent) => touchHandlers.touchMoved(e)
            p.touchEnded = (e: TouchEvent) => touchHandlers.touchEnded(e)

            // const zoomHandler = Controls.zoom(controls.controls)
            // p.mouseWheel = (e: WheelEvent) => zoomHandler.worldZoom(e)
        }

        p.draw = () => {
            controls.controls.view.touchMovedProcessed = false
            // controls.controls.view.touchMovedProcessed = false
            // p.mouseWheel

            p.background(0)
            p.drawGrid()

            p.fill(255, 255, 255, 255)
            // p.rect(100, 100, 100, 100)
            p.ellipse(400, 400, 100, 100)

            // console.log()
            // console.log(`translations and scale`)
            // console.log(controls.controls.view.translation[0])
            // p.translate(
            //     controls.controls.view.translation[0],
            //     controls.controls.view.translation[1]
            // )
            // console.log(controls.controls.view.scale)
            // p.scale(controls.controls.view.scale)
            // console.log(-controls.controls.view.translation[0])
            // p.translate(
            //     -controls.controls.view.translation[0],
            //     -controls.controls.view.translation[1]
            // )

            // p.translate(350, 400)
            // p.scale(3)
            // p.translate(-350, -400)

            // p.applyMatrix(9, 0, 0, 9, -3400, -3200)

            p.drawGrid([255, 255, 0, 127])
            p.fill(255, 255, 0, 127)
            // p.rect(100, 100, 100, 100)
            p.ellipse(400, 400, 100, 100)
            let M: number[][] = controls.controls.view.affineTranslation
            console.log(`affine translation: 
                ${M[0]}
                ${M[1]}
                ${M[2]}
                }`)
            p.applyMatrix(M[0][0], M[1][0], M[0][1], M[1][1], M[0][2], M[1][2])
            // p.applyMatrix(4, 0, 0, 4, -1300, -1200)

            p.drawGrid([255, 0, 255, 127])
            p.fill(255, 0, 255, 127)
            // p.rect(100, 100, 100, 100)
            p.ellipse(400, 400, 100, 100)

            // ##############

            // p.translate(350, 400)
            // p.scale(2)
            // p.translate(-350, -400)
            // p.drawGrid([0, 255, 255, 127])
            // p.ellipse(400, 400, 100, 100)

            // p.translate(450, 400)
            // p.scale(2)
            // p.translate(-450, -400)
            // p.drawGrid([0, 255, 255, 127])
            // p.ellipse(400, 400, 100, 100)

            p.fill(255, 255, 255, 255)
            coastline.display()
        }

        p.windowResized = () => {
            // TODO Add to utilities class
            window_height = window.innerHeight
            window_width = window.innerWidth
            p.resizeCanvas(window_width, window_height)
        }

        p.drawGrid = (colourOpacity: number[] = [255, 255, 255, 255]) => {
            p.fill(colourOpacity)
            p.stroke(colourOpacity)
            for (let i = 0; i < 10000; i += 100) {
                p.text(`${i}`, i, window.innerHeight - 400)
                p.line(i, 0, i, window.innerHeight)
            }
        }
    }

    // TODO learn the below
    useEffect(() => {
        if (myRef.current) {
            const myP5 = new p5(Sketch, myRef.current)
            return () => myP5.remove()
        }
        //   window.addEventListener('wheel', disableZoom, { passive: false })
        //   return () => {
        //       window.removeEventListener('wheel', disableZoom)
        //   }
    }, [])
    return <div ref={myRef}></div>
}

export default MapComponent
