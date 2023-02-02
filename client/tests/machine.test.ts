import { machine } from '@/lib/machine'
import { interpret } from 'xstate'

const EMPTYFILE = new File([''], 'test.png')

// these were copilot-generated tests so they are probably not the best LOL

test('machine state accepts PICKFILE event', (done) => {
    const service = interpret(machine).onTransition(state => {
        if (state.matches('HasFile')) {
            // assert that effects were executed
            expect(state.context.file).not.toBeNull();
            done();
        }
    })
    service.start()
    service.send({ type: 'PICKFILE', file: EMPTYFILE })
})

// test('machine state accepts PICKFILE event when error', () => {
//     const state = machine.initialState
//     const nextState = machine.transition(state, { type: 'PICKFILE', file: EMPTYFILE })
//     const nextState2 = machine.transition(nextState, { type: 'UPLOAD' })
//     const nextState3 = machine.transition(nextState2, { type: 'ERROR', error: 'test' })
//     const nextState4 = machine.transition(nextState3, { type: 'PICKFILE', file: EMPTYFILE })
//     expect(nextState4.matches('HasFile')).toBe(true)
// })

// test('machine removes file when entering success state', () => {
//     const state = machine.initialState
//     const nextState = machine.transition(state, { type: 'PICKFILE', file: EMPTYFILE })
//     const nextState2 = machine.transition(nextState, { type: 'UPLOAD' })
//     const nextState3 = machine.transition(nextState2, { type: 'SUCCESS', latex: 'test' })
//     expect(nextState3.context.file).toBe(null)
// })