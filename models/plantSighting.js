const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const plantSightingSchema = new Schema({
  userNickname: { type: String, required: true },
  dateSeen: { type: Date, required: true },
  identification: {
    commonName: { type: String },
    scientificName: { type: String },
    description: { type: String, required: true },
    dbPediaUri: { type: String },
    photo: { type: String },
    confirmation: { type: String, enum: ['Verified', 'Pending Confirmation'] },
  },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true },
  },
  plantCharacteristics: {
    plantHeight: { type: Number, required: true },
    plantSpread: { type: Number, required: true },
    plantLength: { type: Number, required: true },
    hasFlowers: { type: Boolean, required: true },
    hasFruitsOrSeeds: { type: Boolean, required: true },
    hasLeaves: { type: Boolean, required: true },
    sunExposure: {
      type: String,
      enum: ['full sun', 'partial shade', 'full shade'],
      required: true,
    },
  },
  comments: [
    {
      message: { type: String, required: true },
      date: { type: Date, default: Date.now },
      userNickname: { type: String, required: true },
    },
  ],
});

// toObject() method is called when the document is converted into an object
plantSightingSchema.set('toObject', { virtuals: true });

plantSightingSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('PlantSighting', plantSightingSchema);
