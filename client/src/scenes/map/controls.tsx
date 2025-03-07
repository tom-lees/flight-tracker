// ADD DETAILS
// TODO Does the finger retain its id based on position
// TODO Should I sort keys by location of screen
// TODO If one finger exits change to move#

// TODO ADD click controls and controls reset function

import * as p5 from 'p5'
import { TouchList } from 'react'

const debug = (message: string) => {
    const debugOn: boolean = true
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
        let initialTouches: TouchEvent
        let M0: number[][]
        let IM: number[][] | null
        let totalInitialTouches: number

        const resetTouches = (e: TouchEvent): void => {
            if (!e.touches) return
            debug(`resetTouches: 
                old inital touches = ${totalInitialTouches}
                new inital touches = ${e.touches.length}`)
            totalInitialTouches = e.touches.length
            initialTouches = e
            M0 = controls.view.affineTranslation
        }

        function touchStarted(e: TouchEvent) {
            if (!e.touches || e.touches.length > 2 || e.touches.length < 1)
                return
            debug(`Touch Started`)
            resetTouches(e)
        }

        function touchMoved(e: TouchEvent) {
            debug(`Touch Moved`)
            if (
                !e.touches ||
                e.touches.length > 2 ||
                e.touches.length < 1 ||
                !initialTouches.touches ||
                !totalInitialTouches
            ) {
                return
            }
            IM = inverseAffineMatrix(controls.view.affineTranslation)
            if (!IM) return

            printMatrix(IM, `Inverse Matrix`)

            if (e.touches.length !== totalInitialTouches) {
                debug(`Change in number of touches`)
                resetTouches(e)
            }

            //
            //  Single Finger Touch - Translate Controls
            //
            if (e.touches.length === 1) {
                debug(`1 finger touch`)

                //
                //   Translation values from screen pixels
                //
                let translationX: number = 0
                let translationY: number = 0

                translationX =
                    e.touches[0].clientX - initialTouches.touches[0].clientX
                translationY =
                    e.touches[0].clientY - initialTouches.touches[0].clientY

                console.log(
                    `IM00 IM02 TranslateX ${IM[0][0]}, ${IM[0][2]}, ${translationX}`
                )
                //
                //   Translation values converted to match existing panning and scaling
                //
                // translationX = translationX + IM[0][2]
                //* IM[0][0]
                // translationY = translationY + IM[1][2]
                //* IM[0][0]

                let MT: number[][] = [
                    [1, 0, translationX],
                    [0, 1, translationY],
                    [0, 0, 1],
                ]

                printMatrix(MT, `1 finger MT`)

                MS = multiplyMatrices(M0, MT)

                printMatrix(MS, '1 finger M0')

                controls.view.affineTranslation = MS

                return
            }
            //
            //  Double Finger Touch - Translate Controls
            //
            if (e.touches.length === 2) {
                debug(`2 finger touch`)

                controls.view.scale =
                    distance(
                        [e.touches[0].clientX, e.touches[0].clientY],
                        [e.touches[1].clientX, e.touches[1].clientY]
                    ) /
                    distance(
                        [
                            initialTouches.touches[0].clientX,
                            initialTouches.touches[0].clientY,
                        ],
                        [
                            initialTouches.touches[1].clientX,
                            initialTouches.touches[1].clientY,
                        ]
                    )

                let scaleTranslationX = 0
                let scaleTranslationY = 0

                scaleTranslationX = midpoint(
                    initialTouches.touches[0].clientX,
                    initialTouches.touches[1].clientX
                )
                scaleTranslationY = midpoint(
                    initialTouches.touches[0].clientY,
                    initialTouches.touches[1].clientY
                )

                debug(
                    `midpoint of initial touches: (${scaleTranslationX},${scaleTranslationY}`
                )
                scaleTranslationX = scaleTranslationX * IM[0][0] + IM[0][2]
                scaleTranslationY = scaleTranslationY * IM[0][0] + IM[1][2]

                let T1: number[][] = [
                    [1, 0, scaleTranslationX],
                    [0, 1, scaleTranslationY],
                    [0, 0, 1],
                ]
                let S1: number[][] = [
                    [controls.view.scale, 0, 0],
                    [0, controls.view.scale, 0],
                    [0, 0, 1],
                ]
                let T2: number[][] = [
                    [1, 0, -scaleTranslationX],
                    [0, 1, -scaleTranslationY],
                    [0, 0, 1],
                ]

                let MS: number[][] = M0

                MS = multiplyMatrices(MS, T1)
                MS = multiplyMatrices(MS, S1)
                MS = multiplyMatrices(MS, T2)

                // translationX =
                //     midpoint(e.touches[0].clientX, e.touches[1].clientX) -
                //     midpoint(
                //         initialTouches.touches[0].clientX,
                //         initialTouches.touches[1].clientX
                //     )
                // translationY =
                //     midpoint(e.touches[0].clientY, e.touches[1].clientY) -
                //     midpoint(
                //         initialTouches.touches[0].clientY,
                //         initialTouches.touches[1].clientY
                //     )

                // translationX = translationX * IM[0][0] + IM[0][2]
                // translationY = translationY * IM[0][0] + IM[1][2]

                // let MT: number[][] = [
                //     [1, 0, translationX],
                //     [0, 1, translationY],
                //     [0, 0, 1],
                // ]

                // MS = multiplyMatrices(MS, MT)

                controls.view.affineTranslation = MS

                return
            }
        }

        function touchEnded(e: TouchEvent) {}

        const printMatrix = (M: number[][], name: string) => {
            // Prints a 3x3 matrix to console.
            if (M.length !== 3 || M[0].length !== 3) return
            console.log(`${name}:
                    ${M[0]}
                    ${M[1]}
                    ${M[2]}`)
        }
        function midpoint(point0: number, point1: number) {
            // Midpoint of two point on the same axis.
            return (point0 + point1) / 2
        }

        function distance(point0: number[], point1: number[]) {
            // Distance between two points on the (x,y) plane.
            let dx = point0[0] - point1[0]
            let dy = point0[1] - point1[1]
            return Math.sqrt(dx * dx + dy * dy)
        }

        //
        //  Matrix Functions
        //

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
}
