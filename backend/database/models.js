import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, default: 'member' },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true });

const RescueSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  animalType: { type: String, required: true },
  breed: { type: String, default: 'Unknown' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  locationName: { type: String, required: true },
  lat: { type: Number, default: 0 },
  lng: { type: Number, default: 0 },
  severity: { type: String, default: 'Medium' },
  status: { type: String, default: 'Reported' },
  reportedAt: { type: String, default: () => new Date().toISOString() },
  reporterName: { type: String, default: 'Anonymous' },
  reporterEmail: { type: String, default: '' },
  contactPhone: { type: String, default: '' },
  userId: { type: String, default: '' },
  userEmail: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  timeline: [{
    status: String,
    time: String,
    note: String
  }]
}, { timestamps: true });

const AdoptionPetSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: { type: String, required: true },
  species: { type: String, required: true },
  breed: { type: String, default: '' },
  age: { type: String, default: '' },
  gender: { type: String, default: 'Unknown' },
  size: { type: String, default: 'Medium' },
  vaccinated: { type: Boolean, default: false },
  neutered: { type: Boolean, default: false },
  urgency: { type: String, default: 'Normal' },
  category: { type: String, default: '' },
  location: { type: String, default: '' },
  description: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  tags: [String]
}, { timestamps: true });

const AdoptionApplicationSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  petId: { type: String, default: '' },
  petName: { type: String, default: '' },
  petBreed: { type: String, default: '' },
  petAge: { type: String, default: '' },
  applicantName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  housingType: { type: String, default: 'Apartment' },
  hasOtherPets: { type: String, default: 'No' },
  message: { type: String, default: '' },
  submittedAt: { type: String, default: () => new Date().toISOString() },
  status: { type: String, default: 'Pending Review' }
}, { timestamps: true });

const ConsultationRequestSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  petOwnerName: { type: String, required: true },
  petName: { type: String, required: true },
  animalType: { type: String, default: 'Dog' },
  symptomDescription: { type: String, default: '' },
  preferredTime: { type: String, default: '' },
  phone: { type: String, default: '' },
  createdAt: { type: String, default: () => new Date().toISOString() },
  status: { type: String, default: 'Assigned to Vet' }
}, { timestamps: true });

const PetCareGuideSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  title: { type: String, required: true },
  category: { type: String, default: 'General' },
  targetAnimal: { type: String, default: 'All Animals' },
  symptoms: [String],
  steps: [String],
  warningSign: { type: String, default: '' }
}, { timestamps: true });

const HelperSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: { type: String, required: true },
  role: { type: String, default: '' },
  type: { type: String, default: 'Clinic' },
  address: { type: String, default: '' },
  phone: { type: String, default: '' },
  rating: { type: Number, default: 5.0 },
  available247: { type: Boolean, default: false },
  lat: { type: Number, default: 0 },
  lng: { type: Number, default: 0 },
  services: [String],
  distanceKm: { type: Number, default: 1.0 }
}, { timestamps: true });

export const User = mongoose.model('User', UserSchema);
export const Rescue = mongoose.model('Rescue', RescueSchema);
export const AdoptionPet = mongoose.model('AdoptionPet', AdoptionPetSchema);
export const AdoptionApplication = mongoose.model('AdoptionApplication', AdoptionApplicationSchema);
export const ConsultationRequest = mongoose.model('ConsultationRequest', ConsultationRequestSchema);
export const PetCareGuide = mongoose.model('PetCareGuide', PetCareGuideSchema);
export const Helper = mongoose.model('Helper', HelperSchema);
