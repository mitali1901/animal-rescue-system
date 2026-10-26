import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { syncDataToMongo } from './mongodb.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data.json');

const INITIAL_DATA = {
  rescues: [
    {
      id: 'res-101',
      animalType: 'Dog',
      breed: 'Stray Labrador Mix',
      title: 'Injured Dog near Central Park',
      description: 'Limping left hind paw, appears hungry and dehydrated. Gentle disposition.',
      locationName: 'Corner of 5th Ave & 42nd St',
      lat: 40.758,
      lng: -73.9855,
      severity: 'Medium',
      status: 'Under Vet Care',
      reportedAt: '2026-08-28T14:30:00Z',
      reporterName: 'Sarah Jenkins',
      contactPhone: '+1 (555) 234-5678',
      imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
      timeline: [
        { status: 'Reported', time: '14:30', note: 'Rescue report logged by Sarah' },
        { status: 'Helper Dispatched', time: '14:45', note: 'Volunteer Alex assigned with ambulance' },
        { status: 'Under Vet Care', time: '15:30', note: 'Arrived at Care Vet Clinic. X-ray completed.' }
      ]
    },
    {
      id: 'res-102',
      animalType: 'Cat',
      breed: 'Tabby Kitten',
      title: 'Trapped Kitten in Storm Drain',
      description: 'Small kitten mewing loudly inside drainage pipe. Needs ladder and rescue tool.',
      locationName: 'Oak Street Substation',
      lat: 40.762,
      lng: -73.978,
      severity: 'High',
      status: 'Helper Dispatched',
      reportedAt: '2026-08-29T00:15:00Z',
      reporterName: 'David Miller',
      contactPhone: '+1 (555) 876-5432',
      imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=600&q=80',
      timeline: [
        { status: 'Reported', time: '00:15', note: 'Emergency SOS alert received' },
        { status: 'Helper Dispatched', time: '00:25', note: 'Rescue Team Bravo en route' }
      ]
    },
    {
      id: 'res-103',
      animalType: 'Bird',
      breed: 'Pigeon',
      title: 'Bird with Injured Wing',
      description: 'Found unable to fly on balcony. Wing wrapped temporarily.',
      locationName: 'Pine Ave Apartments',
      lat: 40.751,
      lng: -73.991,
      severity: 'Low',
      status: 'Recovered',
      reportedAt: '2026-08-27T09:00:00Z',
      reporterName: 'Elena Rostova',
      contactPhone: '+1 (555) 345-6789',
      imageUrl: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80',
      timeline: [
        { status: 'Reported', time: '09:00', note: 'Reported by Elena' },
        { status: 'Under Vet Care', time: '10:30', note: 'Splint applied at Avian Care Center' },
        { status: 'Recovered', time: '18:00', note: 'Successfully healed and released back to nature!' }
      ]
    }
  ],
  adoptions: [
    {
      id: 'pet-1',
      name: 'Bella',
      species: 'Dog',
      breed: 'Golden Retriever Mix',
      age: '1.5 Years',
      gender: 'Female',
      size: 'Medium',
      vaccinated: true,
      neutered: true,
      urgency: 'Normal',
      location: 'Haven Shelter, Downtown',
      description: 'Bella is an incredibly affectionate and cheerful girl who loves fetch and gentle belly rubs. Great with children and other pets!',
      imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
      tags: ['Friendly', 'House-Trained', 'Playful', 'Good with Kids']
    },
    {
      id: 'pet-2',
      name: 'Oliver',
      species: 'Cat',
      breed: 'British Shorthair Mix',
      age: '8 Months',
      gender: 'Male',
      size: 'Small',
      vaccinated: true,
      neutered: true,
      urgency: 'Urgent Foster',
      location: 'Purr Haven Rescue',
      description: 'Oliver was rescued from a rainy alleyway. He is a purring machine who loves window spots and feather toys.',
      imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
      tags: ['Cuddle Bug', 'Litter-Trained', 'Calm', 'Indoor Only']
    },
    {
      id: 'pet-3',
      name: 'Milo & Otis',
      species: 'Dog',
      breed: 'Beagle Puppies',
      age: '4 Months',
      gender: 'Male',
      size: 'Small',
      vaccinated: true,
      neutered: false,
      urgency: 'Normal',
      location: 'Sunny Meadows Rescue',
      description: 'Inseparable energetic duo! Looking for a loving household with a yard where they can explore together.',
      imageUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=600&q=80',
      tags: ['Bonded Pair', 'Energetic', 'Puppy', 'Needs Yard']
    },
    {
      id: 'pet-4',
      name: 'Cleo',
      species: 'Cat',
      breed: 'Siamese Mix',
      age: '2 Years',
      gender: 'Female',
      size: 'Medium',
      vaccinated: true,
      neutered: true,
      urgency: 'Normal',
      location: 'City Animal Care',
      description: 'Vocal, intelligent, and highly affectionate companion. Cleo greets you at the door every time you return home.',
      imageUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=80',
      tags: ['Vocal', 'Smart', 'Lap Cat', 'Single Pet Preferred']
    },
    {
      id: 'pet-5',
      name: 'Sunny',
      species: 'Bird',
      category: 'Cockatiel',
      breed: 'Yellow-Crested Cockatiel',
      age: '1 Year',
      gender: 'Male',
      size: 'Small',
      vaccinated: true,
      neutered: false,
      urgency: 'Normal',
      location: 'Feathered Friends Rescue',
      description: 'Sunny is a cheerful hand-tame Cockatiel who whistles happy tunes and bows for gentle head scratches. Loves seeds and gentle company.',
      imageUrl: '/images/birds/cockatiel.jpg',
      tags: ['Whistler', 'Hand-Tame', 'Gentle', 'Quiet', 'Cockatiel']
    },
    {
      id: 'pet-7',
      name: 'Rio',
      species: 'Bird',
      category: 'Parrot & Macaw',
      breed: 'Scarlet Macaw',
      age: '4 Years',
      gender: 'Male',
      size: 'Large',
      vaccinated: true,
      neutered: false,
      urgency: 'Urgent Foster',
      location: 'Tropical Wings Sanctuary',
      description: 'Rio is a magnificent, highly intelligent Scarlet Macaw who knows 15+ words and phrases. Looking for an experienced bird lover with ample space.',
      imageUrl: '/images/birds/macaw.jpg',
      tags: ['Vocal Talker', 'Intelligent', 'Urgent Foster', 'Experienced', 'Macaw']
    },
    {
      id: 'pet-8',
      name: 'Kiwi & Pip',
      species: 'Bird',
      category: 'Budgie & Parakeet',
      breed: 'Bonded Budgies (Parakeets)',
      age: '8 Months',
      gender: 'Pair',
      size: 'Small',
      vaccinated: true,
      neutered: false,
      urgency: 'Normal',
      location: 'Sunny Meadow Avian Haven',
      description: 'Inseparable cheerful budgie pair with vibrant turquoise and emerald plumage! They chirp melodies, eat greens, and are beginner-friendly.',
      imageUrl: '/images/birds/budgies.jpg',
      tags: ['Bonded Pair', 'Beginner Friendly', 'Playful', 'Chirpy', 'Budgie']
    },
    {
      id: 'pet-9',
      name: 'Mango & Peaches',
      species: 'Bird',
      category: 'Lovebird',
      breed: 'Peach-Faced Lovebirds',
      age: '1.5 Years',
      gender: 'Pair',
      size: 'Small',
      vaccinated: true,
      neutered: false,
      urgency: 'Urgent Foster',
      location: 'Small Wings Sanctuary',
      description: 'Deeply bonded peach-faced lovebird pair who groom each other constantly. Very active and curious, they love climbing and foraging toys.',
      imageUrl: '/images/birds/lovebirds.jpg',
      tags: ['Bonded Pair', 'Cuddle Bugs', 'Curious', 'Colorful', 'Lovebird']
    },
    {
      id: 'pet-10',
      name: 'Casper',
      species: 'Bird',
      category: 'Cockatoo',
      breed: 'Sulphur-Crested Cockatoo',
      age: '3 Years',
      gender: 'Male',
      size: 'Large',
      vaccinated: true,
      neutered: false,
      urgency: 'Normal',
      location: 'Haven Avian Sanctuary',
      description: 'Casper is an energetic, affectionate white Cockatoo who dances to music, bobs his head, and raises his golden crest when happy. Loves interactive attention.',
      imageUrl: '/images/birds/cockatoo.jpg',
      tags: ['Dancer', 'Loves Music', 'Affectionate', 'Playful', 'Cockatoo']
    },
    {
      id: 'pet-11',
      name: 'Chirpy',
      species: 'Bird',
      category: 'Canary & Finch',
      breed: 'Yellow Song Canary',
      age: '1 Year',
      gender: 'Male',
      size: 'Small',
      vaccinated: true,
      neutered: false,
      urgency: 'Normal',
      location: 'City Songbird Rescue',
      description: 'Chirpy has a bright golden coat and fills the room with melodic, soothing songs every sunrise. Independent, gentle, and perfect for peaceful apartment living.',
      imageUrl: '/images/birds/canary.jpg',
      tags: ['Melodic Singer', 'Calm', 'Apartment Friendly', 'Gentle', 'Canary']
    },
    {
      id: 'pet-12',
      name: 'Skye',
      species: 'Bird',
      category: 'Conure & Lorikeet',
      breed: 'Rainbow Lorikeet',
      age: '2 Years',
      gender: 'Female',
      size: 'Medium',
      vaccinated: true,
      neutered: false,
      urgency: 'Normal',
      location: 'Avian Care Center',
      description: 'Skye is a dazzling, colorful acrobat with a huge personality! She loves hanging upside down, playing with bells, and splashing in shallow bird baths.',
      imageUrl: '/images/birds/lorikeet.jpg',
      tags: ['Acrobatic', 'Colorful', 'Playful', 'Energetic', 'Lorikeet']
    },
    {
      id: 'pet-6',
      name: 'Barnaby',
      species: 'Bunny',
      breed: 'Holland Lop',
      age: '1 Year',
      gender: 'Male',
      size: 'Small',
      vaccinated: true,
      neutered: true,
      urgency: 'Urgent Foster',
      location: 'Small Paws Sanctuary',
      description: 'Soft floppy-eared bunny who loves fresh parsley and carrot treats. Litter box trained!',
      imageUrl: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=80',
      tags: ['Litter-Trained', 'Soft', 'Gentle', 'Quiet Home']
    }
  ],
  petCareGuides: [
    {
      id: 'guide-1',
      title: 'First Aid for Injured Paw or Wound',
      category: 'First Aid',
      targetAnimal: 'Dog / Cat',
      symptoms: ['Limping', 'Bleeding paw', 'Crying on step'],
      steps: [
        'Muzzle gently if in pain to prevent accidental biting.',
        'Flush wound gently with sterile saline or lukewarm clean water.',
        'Apply pressure with clean gauze to stop minor bleeding.',
        'Wrap loosely with self-adhesive bandage (do not restrict circulation).',
        'Contact a vet immediately if wound is deep or bleeding persists.'
      ],
      warningSign: 'Severe swelling, bone visibility, or continuous bleeding over 10 minutes.'
    },
    {
      id: 'guide-2',
      title: 'Dealing with Heatstroke & Dehydration',
      category: 'Emergency',
      targetAnimal: 'All Animals',
      symptoms: ['Excessive panting', 'Drooling', 'Lethargy', 'Bright red gums'],
      steps: [
        'Move pet immediately into cool shade or air-conditioned space.',
        'Offer small sips of cool (not ice cold) drinking water.',
        'Wipe paws, belly, and ears with cool damp towels.',
        'Turn on a fan to increase airflow across the body.',
        'Transport immediately to nearest emergency vet clinic.'
      ],
      warningSign: 'Vomiting, collapse, or loss of consciousness.'
    },
    {
      id: 'guide-3',
      title: 'Treating Mild Eye Irritation / Discharge',
      category: 'General Remedy',
      targetAnimal: 'Cat / Dog',
      symptoms: ['Squinting', 'Watery eye discharge', 'Red eyelid'],
      steps: [
        'Clean surrounding fur gently with a warm, damp cotton ball (use separate ball for each eye).',
        'Check for loose eyelash or dust.',
        'Do NOT use human eye drops, as they can cause severe injury to pet eyes.',
        'If discharge turns yellow/green, schedule a vet check for antibiotic eye drops.'
      ],
      warningSign: 'Cloudy cornea, eye held completely shut, or visible scratches.'
    },
    {
      id: 'guide-4',
      title: 'Kitten Feeding & Hypothermia Prevention',
      category: 'Orphan Care',
      targetAnimal: 'Cat (Kitten)',
      symptoms: ['Cold body', 'Constant crying', 'Weak suckling'],
      steps: [
        'Warm the kitten FIRST before attempting to feed. Use warm water bottle wrapped in towel.',
        'Feed ONLY specialized Kitten Milk Replacer (KMR) using a kitten nursing bottle or syringe.',
        'NEVER feed cow’s milk as it causes fatal diarrhea in young kittens.',
        'Stimulate urination/defecation after feeding using warm damp cotton pad on genital area.'
      ],
      warningSign: 'Unresponsive body temperature or refusal to suckle for > 8 hours.'
    }
  ],
  helpers: [
    {
      id: 'hlp-1',
      name: 'Dr. Emily Watson (Vet Clinic)',
      role: 'Emergency Vet Clinic',
      type: 'Clinic',
      address: '142 Healing Way, Downtown',
      phone: '+1 (555) 999-1122',
      rating: 4.9,
      available247: true,
      lat: 40.759,
      lng: -73.982,
      services: ['Surgery', 'Emergency Care', 'X-Ray', 'Vaccination'],
      distanceKm: 0.4
    },
    {
      id: 'hlp-2',
      name: 'Paws Rescue Ambulance Unit #3',
      role: 'Mobile Emergency Rescue',
      type: 'Ambulance',
      address: 'Patrolling Midtown District',
      phone: '+1 (555) 888-3344',
      rating: 5.0,
      available247: true,
      lat: 40.755,
      lng: -73.988,
      services: ['Animal Capture', 'Trauma First Aid', 'Transport'],
      distanceKm: 0.7
    },
    {
      id: 'hlp-3',
      name: 'Alex Rivera (Volunteer Responder)',
      role: 'Certified Wildlife & Animal Handler',
      type: 'Volunteer',
      address: 'Eastside District',
      phone: '+1 (555) 777-5566',
      rating: 4.8,
      available247: false,
      lat: 40.764,
      lng: -73.973,
      services: ['Cat/Dog Trapping', 'Foster Care', 'Bird Rescue'],
      distanceKm: 1.2
    },
    {
      id: 'hlp-4',
      name: 'St. Francis Animal Hospital',
      role: '24/7 Pet Hospital & ICU',
      type: 'Hospital',
      address: '88 Riverbed Road',
      phone: '+1 (555) 444-2211',
      rating: 4.9,
      available247: true,
      lat: 40.748,
      lng: -73.995,
      services: ['24/7 ICU', 'Blood Bank', 'Orthopedic Surgery'],
      distanceKm: 1.8
    },
    {
      id: 'hlp-5',
      name: 'Samantha Green (Pet Care Specialist)',
      role: 'Pet Healthcare & Home Remedies Helper',
      type: 'Consultant',
      address: 'Greenwood Neighborhood',
      phone: '+1 (555) 333-6677',
      rating: 4.7,
      available247: false,
      lat: 40.768,
      lng: -73.980,
      services: ['Home Pet Care', 'Wound Bandaging', 'Diet Advice'],
      distanceKm: 1.5
    }
  ],
  adoptionApplications: [
    {
      id: 'app-seed-1',
      petId: 'pet-1',
      petName: 'Bella',
      applicantName: 'Sophia Martinez',
      email: 'sophia@example.com',
      phone: '+1 (555) 321-9876',
      housingType: 'Single Family House with Fenced Yard',
      hasOtherPets: 'Yes, 1 friendly Golden Retriever',
      message: 'We are a loving family looking for a playmate for our dog Cooper. Bella will have a huge yard and constant love!',
      submittedAt: '2026-08-28T16:20:00Z',
      status: 'Approved & Schedule Visit'
    },
    {
      id: 'app-seed-2',
      petId: 'pet-2',
      petName: 'Oliver',
      applicantName: 'Lucas Vance',
      email: 'lucas.v@example.com',
      phone: '+1 (555) 432-1098',
      housingType: 'Sunny Apartment',
      hasOtherPets: 'No, looking for first cat',
      message: 'I work remotely and have a cozy apartment with sunlit window perches perfect for Oliver.',
      submittedAt: '2026-08-29T08:10:00Z',
      status: 'Pending Review'
    }
  ],
  consultationRequests: [
    {
      id: 'consult-seed-1',
      petOwnerName: 'Daniel Kim',
      petName: 'Rocky (German Shepherd)',
      animalType: 'Dog',
      symptomDescription: 'Slight limping on right front paw after park run. No bleeding visible, but whimpers when touched.',
      preferredTime: 'Today Evening (6:00 PM)',
      phone: '+1 (555) 654-3210',
      createdAt: '2026-08-29T10:45:00Z',
      status: 'Assigned to Dr. Emily Watson'
    }
  ]
};

// Ensure data file exists and incorporates seed structures
export function initDb() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
    console.log('Database initialized with default seed data.');
  } else {
    // Migrate existing DB if adoptionApplications or consultationRequests are missing
    try {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const data = JSON.parse(raw);
      let updated = false;
      if (!data.adoptionApplications) {
        data.adoptionApplications = INITIAL_DATA.adoptionApplications;
        updated = true;
      }
      if (!data.consultationRequests) {
        data.consultationRequests = INITIAL_DATA.consultationRequests;
        updated = true;
      }
      if (updated) {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
      }
    } catch (err) {
      console.error('Error migrating DB:', err);
    }
  }
}

export function readDb() {
  try {
    initDb();
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading DB:', err);
    return INITIAL_DATA;
  }
}

export function writeDb(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    // Asynchronously synchronize changes to MongoDB
    syncDataToMongo(data).catch(() => {});
  } catch (err) {
    console.error('Error writing DB:', err);
  }
}
