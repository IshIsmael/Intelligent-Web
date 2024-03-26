let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Schema for Comments Model
const CommentSchema = new Schema({
    message: { type: String, required: true, max: 100},
    date: { type: Date, default: Date.now },
    userNickname: { type: String, required: true}
});

// Schema for PlantSighting Model
const PlantSightingSchema = new Schema({
    photo: { type: String, required: false},
    identification:{
        plantName: { type: String, required: false}, 
        idConfirmation: { type: String, enum: ['Confirmed', 'Not Confirmed'], required: true}, 
        dbPediaUrl: { type: String, required: false}
    },
    // GeoJSON for location
    location:{
        type: { type: String, default: 'Point'}, 
        coordinates: { type: [Number], required: true} 
    },
    dateSeen: { type: Date, default: Date.now }, 
    description: { type: String, required: false, max: 1000}, 
    plantCharacteristics:{
        height: { type: Number, required: true},
        spread: { type: Number, required: true}, 
        hasFlowers: { type: Boolean, required: true },
        hasLeaves: { type: Boolean, required: true }, 
        hasFruitsOrSeeds: { type: Boolean, required: true },
        sunExposure: { type: String, enum: ['full sun', 'partial shade', 'full shade'], required: true },
        flowerColor: { type: String, required: false }
    },
    userNickname: { type: String, required: true}, 
    //CommentSchema nested
    comments: [CommentSchema]
}, {timestamps: true});

// toObject transform
PlantSightingSchema.set('toObject', { getters: true, virtuals: true });

// for location based queries
PlantSightingSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('PlantSighting', PlantSightingSchema);