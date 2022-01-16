import { Schema, model } from 'mongoose'

interface Peep {
  squawkId: string
  peeps: [{ peep: string; peepId: string }]
}

const schema = new Schema<Peep>({
  squawkId: { type: String, required: true },
  peeps: { type: [{ peep: String, peepId: String }], required: true },
})

const PeepModel = model<Peep>('Peep', schema)

export default PeepModel
