const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    specialty: String,
    location: String,
    languages: [String],
    qualifications: [String],
    bio: String,
    photoUrl: String,
    rating: { type: Number, default: 0 },
    reviews: [
      {
        patientName: String,
        comment: String,
        stars: Number,
        date: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', DoctorSchema);