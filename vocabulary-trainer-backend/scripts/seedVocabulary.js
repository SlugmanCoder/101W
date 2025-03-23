require('dotenv').config();
const mongoose = require('mongoose');
const Vocabulary = require('../models/Vocabulary');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.log(err));

const vocabularyWords = [
        {
          "word": "adulation",
          "definition": "excessive flattery or praise",
          "exampleSentence": "Self-adulation is one of the worst traits of good leaders because it leads them to corruption."
        },
        {
          "word": "adulterate",
          "definition": "make something worse by adding to it",
          "exampleSentence": "To get his kids bigger, the parent adulterated their chocolate smoothie by mixing in protein the kids didn’t know about until tasting."
        },
        {
          "word": "aesthetic",
          "definition": "relating to beauty",
          "exampleSentence": "Anyone who sees the celebrity’s mansion that overlooks the ocean will have an aesthetic appreciation for the home."
        },
        {
          "word": "amicable",
          "definition": "friendly and agreeable spirit",
          "exampleSentence": "When you’re looking for sympathy, find an amicable friend who will help you relax."
        },
        {
          "word": "amok",
          "definition": "behave in an out of control fashion",
          "exampleSentence": "After Jenny saw a shark in the ocean 25 feet away, she swam amok to the beach."
        },
        {
          "word": "analogous",
          "definition": "comparable or similar",
          "exampleSentence": "Samantha’s new boyfriend looks analogous to her previous ex-boyfriends."
        },
        {
          "word": "antithesis",
          "definition": "the exact opposite of someone, something, or some idea",
          "exampleSentence": "The two presidential candidates are the antithesis to each other when it comes to their beliefs on foreign policy: one prefers isolationism and the other prefers interventionism."
        },
        {
          "word": "apathetic",
          "definition": "having no emotion, feeling, or concern",
          "exampleSentence": "The defense lawyer’s appeal for mercy on his client’s 5-year prison sentence didn’t sway the apathetic judge."
        },
        {
          "word": "assuage",
          "definition": "to provide relief and make less intense",
          "exampleSentence": "After the E. coli outbreak in its restaurants, Chipotle assuaged its customers with an offer for a free burrito."
        },
        {
          "word": "asylum",
          "definition": "protection granted by a country for a political refugee who has left their native country, or a place of safety",
          "exampleSentence": "Many political refugees seek asylum when they believe they will be killed in their native country if they’re forced to return."
        },
        {
          "word": "audacious",
          "definition": "willing to take bold risks",
          "exampleSentence": "Alexander the Great is known as an audacious leader who conquered an indescribable amount of land during his reign as king."
        },
        {
          "word": "banal",
          "definition": "lacking originality so it’s boring",
          "exampleSentence": "If you want the same movie over and over again, even if it’s your favorite it will turn banal."
        },
        {
          "word": "binary",
          "definition": "something that consists of two parts",
          "exampleSentence": "The binary compound, which contains two rare chemicals, needs to be investigated further before a comment is made."
        },
        {
          "word": "buttress",
          "definition": "something that gives support to another structure",
          "exampleSentence": "If buildings aren’t designed with a proper buttress, they’re likely to break the fire code because they could collapse with enough stress."
        },
        {
          "word": "carpe diem",
          "definition": "the idea of living in the moment and not worrying about the future (translates to 'seize the day')",
          "exampleSentence": "I didn’t want to go out, but my housemate said, 'It’s senior year and we won’t get to do this after we graduate, carpe diem.'"
        },
        {
          "word": "cartographer",
          "definition": "one who creates maps",
          "exampleSentence": "Where they previously had to sketch terrains and locations by hand, cartographers have utilized computer software to create stunning maps."
        },
        {
          "word": "caveat",
          "definition": "a warning about a particular statement that should be remembered",
          "exampleSentence": "Stores will offer amazing discount deals to their customers, only to include a major caveat when they check out that makes the offer less of a home run."
        },
        {
          "word": "circumspect",
          "definition": "carefully thinking about all the possible consequences and effects before doing something",
          "exampleSentence": "To keep his reputation in good shape with his colleagues, Dr. Huiyt acted circumspect with his finding before publishing it in Scientific American."
        },
        {
          "word": "clairvoyant",
          "definition": "seeing events in the future",
          "exampleSentence": "If I was clairvoyant about future sporting events, you better believe I would go to Vegas and make millions off of sports bets."
        },
        {
          "word": "colloquial",
          "definition": "using informal language in conversation",
          "exampleSentence": "When the job applicant talked to the interviewer in a colloquial tone, he didn’t take her seriously and thought she was unprofessional."
        },
        {
          "word": "condone",
          "definition": "to accept and allow",
          "exampleSentence": "While the company does not condone the act of asking for a raise, it is acceptable if done in the right way."
        },
        {
          "word": "consensus",
          "definition": "general agreement about something",
          "exampleSentence": "The consensus from the group was to meet twice a month on Tuesday nights."
        },
        {
          "word": "cursory",
          "definition": "not thorough or detailed",
          "exampleSentence": "The student’s cursory research paper was full of mistakes and lacked a clear focus."
        },
        {
          "word": "debunk",
          "definition": "to show the falseness of a story",
          "exampleSentence": "The scientist debunked the myth that certain vaccines cause autism in children."
        },
        {
          "word": "diatribe",
          "definition": "an angry speech or piece of writing that severely criticizes something",
          "exampleSentence": "Upset about his demotion, Ed made an angry diatribe about his employer."
        },
        {
          "word": "disenfranchise",
          "definition": "to deprive someone of a right or privilege",
          "exampleSentence": "The U.S. Supreme Court’s decision will disenfranchise millions of voters."
        }  
];

const seedVocabulary = async () => {
  try {
    await mongoose.connection.dropCollection('vocabularies').catch(() => {});
    await mongoose.model('Vocabulary').insertMany(vocabularyWords);
    console.log('Vocabulary seeded successfully!');
  } catch (error) {
    console.log('Seeding failed:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedVocabulary();