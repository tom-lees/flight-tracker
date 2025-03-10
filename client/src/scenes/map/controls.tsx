// ADD DETAILS
// TODO Does the finger retain its id based on position
// TODO Should I sort keys by location of screen
// TODO If one finger exits change to move#

// TODO ADD click controls and controls reset function

import * as p5 from 'p5'
import { toASCII } from 'punycode'

const debug = (message: string) => {
    const debugOn: boolean = false
    if (debugOn) console.log(message)
}

type View = {
    translation: number[]
    scale: number
    touchMovedProcessed: boolean
    affineTranslation: number[][]
}
type Touch = {
    x: number | null
    y: number | null
    id: number | null
}
type Fingers = {
    finger0: Touch | null
    finger1: Touch | null
}
type ControlsType = {
    view: View
    initialPositionFingers: Fingers
    livePositionFingers: Fingers
}

export default class Controls {
    p: p5
    controls: ControlsType

    constructor(p: p5) {
        this.p = p
        this.controls = {
            view: {
                translation: [0, 0],
                scale: 1,
                touchMovedProcessed: false,
                affineTranslation: [
                    [1, 0, 0],
                    [0, 1, 0],
                    [0, 0, 1],
                ],
            },
            initialPositionFingers: { finger0: null, finger1: null },
            livePositionFingers: { finger0: null, finger1: null },
        }
    }

    static touch(controls: ControlsType) {
        let initialTouches: TouchList
        let M0: number[][]
        let IM: number[][] | null

        function touchStarted(e: TouchEvent) {
            if (!e.touches || e.touches.length !== 2) return
            initialTouches = e.touches
            M0 = controls.view.affineTranslation
        }

        function touchMoved(e: TouchEvent) {
            if (!e.touches || e.touches.length !== 2 || !initialTouches) {
                return
            }
            IM = inverseAffineMatrix(controls.view.affineTranslation)
            if (!IM) return
            debug(`IM:
                ${IM[0]}
                ${IM[1]}
                ${IM[2]}`)

            controls.view.scale = distance(e.touches) / distance(initialTouches)

            let translationX: number =
                midpoint(initialTouches)[0] +
                (midpoint(initialTouches)[0] - midpoint(e.touches)[0])

            let translationY: number =
                midpoint(initialTouches)[1] +
                (midpoint(initialTouches)[1] - midpoint(e.touches)[1])

            translationX = translationX * IM[0][0] + IM[0][2]
            translationY = translationY * IM[0][0] + IM[1][2]

            let T1: number[][] = [
                [1, 0, translationX],
                [0, 1, translationY],
                [0, 0, 1],
            ]
            let S1: number[][] = [
                [controls.view.scale, 0, 0],
                [0, controls.view.scale, 0],
                [0, 0, 1],
            ]
            let T2: number[][] = [
                [1, 0, -translationX],
                [0, 1, -translationY],
                [0, 0, 1],
            ]

            let M1: number[][] = multiplyMatrices(M0, T1)
            let M2: number[][] = multiplyMatrices(M1, S1)
            let MX: number[][] = multiplyMatrices(M2, T2)

            console.log(`T1:
                ${T1[0]}
                ${T1[1]}
                ${T1[2]}`)
            console.log(`S1:
                ${S1[0]}
                ${S1[1]}
                ${S1[2]}`)
            console.log(`T2:
                ${T2[0]}
                ${T2[1]}
                ${T2[2]}`)

            let MXprint: number[][] = MX.map((row) =>
                row.map((number) => Math.round(number * 10) / 10)
            )

            console.log(`MX:
                ${MXprint[0]}
                ${MXprint[1]}
                ${MXprint[2]}`)

            controls.view.affineTranslation = MX

            return
        }

        function touchEnded(e: TouchEvent) {}

        function midpoint(touches: TouchList) {
            let [t0, t1] = touches
            return [
                (t0.clientX + t1.clientX) / 2,
                (t0.clientY + t1.clientY) / 2,
            ]
        }
        // function midpoint(left: number, right: number) {
        //     return (left + right) / 2
        // }
        function distance(touches: TouchList) {
            let [t0, t1] = touches
            let dx = t0.clientX - t1.clientX
            let dy = t0.clientY - t1.clientY
            return Math.sqrt(dx * dx + dy * dy)
        }
        // function distance(left: number, right: number) {
        //     let dx = left - right
        //     return Math.sqrt(dx * dx)
        // }

        function multiplyMatrices(m1: number[][], m2: number[][]) {
            var result: number[][] = []
            for (var i = 0; i < m1.length; i++) {
                result[i] = []
                for (var j = 0; j < m2[0].length; j++) {
                    var sum = 0
                    for (var k = 0; k < m1[0].length; k++) {
                        sum += m1[i][k] * m2[k][j]
                    }
                    result[i][j] = sum
                }
            }
            return result
        }

        function inverseAffineMatrix(M: number[][]): number[][] | null {
            if (!M || M.length !== 3 || M[0].length !== 3) {
                debug(
                    `controls.tsx inverseAffineMatrix: Matrix null or wrong dimensions`
                )
                return null
            }
            if (M[2][0] !== 0 || M[2][1] !== 0 || M[2][2] !== 1) {
                debug(
                    `controls.tsx inverseAffineMatrix: Affine matrix bottom row not |0,0,1|`
                )
                return null
            }
            if (M[0][0] !== M[1][1]) {
                debug(
                    `controls.tsx inverseAffineMatrix: Affine matrix scales not equal, M[0][0]!==M[1][1]`
                )
                return null
            }
            let scale: number = 1 / M[0][0]
            let tranlateX: number = (-1 * M[0][2]) / M[0][0]
            let translateY: number = (-1 * M[1][2]) / M[0][0]

            return [
                [scale, 0, tranlateX],
                [0, scale, translateY],
                [0, 0, 1],
            ]
        }

        return {
            // mousePressed,
            // mouseDragged,
            // mouseReleased,
            touchStarted,
            touchMoved,
            touchEnded,
        }
    }

    // static zoom(controls: ControlsType) {
    //     function worldZoom(e: WheelEvent) {
    //         console.log('wheel event')
    //         let controlsViewX = controls.view.x
    //         let controlsViewY = controls.view.y
    //         let controlsZoom = controls.view.zoom
    //         // deltaY would normally control scroll behaviour.  However here it is zoom.
    //         const { x, y, deltaY } = e
    //         const direction = deltaY > 0 ? -1 : 1
    //         const factor = 0.75
    //         let zoom = 1 * direction * factor

    //         const wx = (x - controlsViewX) / (window.innerWidth * controlsZoom)
    //         const wy = (y - controlsViewY) / (window.innerHeight * controlsZoom)
    //         controlsViewX -= wx * window.innerWidth * zoom
    //         controlsViewY -= wy * window.innerHeight * zoom

    //         // Set minimum and maximum zoom levels
    //         const minZoom = 0.5 // Minimum zoom level to avoid inversion
    //         const maxZoom = 10 // Maximum zoom level to avoid excessive zoom
    //         const newZoom = controlsZoom + zoom

    //         // Only apply zoom if within the allowed range
    //         if (newZoom >= minZoom && newZoom <= maxZoom) {
    //             controls.view.zoom = newZoom
    //             controls.view.x = controlsViewX
    //             controls.view.y = controlsViewY
    //         }
    //     }
    //     return { worldZoom }
    // }
}

//   translate(-centrex*(_scale-1),
//             -centrey*(_scale-1));
//   scale(_scale);
