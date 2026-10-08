import { CropRecommendation } from '../types';

export const cropDatabase: CropRecommendation[] = [
  // --- LOW WATER / DROUGHT RESISTANT CROPS ---
  {
    id: 'crop-bajra',
    name: {
      en: 'Pearl Millet (Bajra)',
      hi: 'बाजरा (Bajra)',
      ta: 'கம்பு (Kambu / Pearl Millet)'
    },
    category: 'millet',
    waterRequirement: 'very_low',
    waterRequirementMm: 250,
    season: 'Kharif',
    suitableStates: ['rajasthan', 'tamil_nadu'],
    suitableSeverity: ['over-exploited', 'critical', 'semi-critical', 'safe'],
    durationDays: 85,
    irrigationMethod: 'Rainfed / 1-2 life-saving sprinkler irrigations',
    expectedYieldPerAcre: '12 - 16 Quintals',
    estimatedNetProfitPerAcre: '₹22,000 - ₹28,000',
    suitableSoil: ['Sandy loam', 'Light sandy', 'Red soil'],
    advisoryNote: {
      en: 'Extremely drought tolerant. Thrives in critical & over-exploited zones with deep water tables. Consumes 60% less water than maize.',
      hi: 'अत्यधिक सूखा प्रतिरोधी। गहरे भूजल और कम पानी वाले क्षेत्रों के लिए सबसे उपयुक्त फसल। मक्के की तुलना में 60% कम पानी की खपत।',
      ta: 'வறட்சியைத் தாங்கும் சிறந்த பயிர். நிலத்தடி நீர் மட்டம் மிகவும் குறைவாக உள்ள பகுதிகளுக்கு மிகவும் உகந்தது.'
    },
    riskLevel: 'safe'
  },
  {
    id: 'crop-mustard',
    name: {
      en: 'Mustard / Rapeseed (Sarson)',
      hi: 'सरसों (Mustard)',
      ta: 'கடுகு (Mustard)'
    },
    category: 'oilseed',
    waterRequirement: 'low',
    waterRequirementMm: 310,
    season: 'Rabi',
    suitableStates: ['rajasthan'],
    suitableSeverity: ['critical', 'semi-critical', 'safe'],
    durationDays: 110,
    irrigationMethod: 'Sprinkler / Furrow (2-3 irrigations only)',
    expectedYieldPerAcre: '8 - 12 Quintals',
    estimatedNetProfitPerAcre: '₹32,000 - ₹42,000',
    suitableSoil: ['Loamy', 'Sandy loam', 'Alluvial'],
    advisoryNote: {
      en: 'Ideal winter cash crop for Rajasthan. Highly remunerative with low water footprint. Critical watering only at flowering & pod filling.',
      hi: 'राजस्थान के लिए आदर्श रबी नकदी फसल। कम पानी में अधिकतम मुनाफा। केवल फूल आते समय और दाना भरते समय हल्की सिंचाई करें।',
      ta: 'குறைந்த நீர் தேவையும் அதிக லாபமும் தரும் குளிர்கால பயிர்.'
    },
    riskLevel: 'safe'
  },
  {
    id: 'crop-moong',
    name: {
      en: 'Green Gram (Moong Dal)',
      hi: 'मूंग दाल (Moong Dal)',
      ta: 'பாசிப்பயறு (Green Gram)'
    },
    category: 'pulse',
    waterRequirement: 'very_low',
    waterRequirementMm: 280,
    season: 'Kharif',
    suitableStates: ['rajasthan', 'tamil_nadu'],
    suitableSeverity: ['over-exploited', 'critical', 'semi-critical', 'safe'],
    durationDays: 65,
    irrigationMethod: 'Micro-sprinkler or rainfed',
    expectedYieldPerAcre: '5 - 7 Quintals',
    estimatedNetProfitPerAcre: '₹25,000 - ₹35,000',
    suitableSoil: ['Sandy loam', 'Red loam', 'Black soil'],
    advisoryNote: {
      en: 'Short-duration pulse that fixes soil nitrogen. Recommended for severely depleted aquifers to replenish soil and conserve water.',
      hi: 'कम अवधि वाली दलहनी फसल जो मिट्टी में नाइट्रोजन बढ़ाती है। पानी की भारी बचत के साथ अच्छा बाजार भाव।',
      ta: 'குறுகிய கால பயிர் மற்றும் மண்ணின் வளத்தை அதிகரிக்கும். குறைந்த நீரில் அதிக பலன்.'
    },
    riskLevel: 'safe'
  },
  {
    id: 'crop-ragi',
    name: {
      en: 'Finger Millet (Ragi)',
      hi: 'रागी / मडुआ (Ragi)',
      ta: 'கேழ்வரகு / ராகி (Ragi)'
    },
    category: 'millet',
    waterRequirement: 'low',
    waterRequirementMm: 350,
    season: 'Kharif',
    suitableStates: ['tamil_nadu'],
    suitableSeverity: ['over-exploited', 'critical', 'semi-critical', 'safe'],
    durationDays: 100,
    irrigationMethod: 'Drip or alternate furrow',
    expectedYieldPerAcre: '14 - 18 Quintals',
    estimatedNetProfitPerAcre: '₹28,000 - ₹38,000',
    suitableSoil: ['Red loam', 'Clay loam', 'Laterite'],
    advisoryNote: {
      en: 'Prime climate-resilient staple for Tamil Nadu. Highly adapted to hard-rock rainfed zones like Dharmapuri, Salem, and Coimbatore.',
      hi: 'तमिलनाडु के लिए सूखा प्रतिरोधी पोषक अनाज। कठोर चट्टानी और कम पानी वाले क्षेत्रों के लिए सर्वोत्तम।',
      ta: 'தமிழ்நாட்டின் மிகச்சிறந்த ஊட்டச்சத்து நிறைந்த சிறுதானியம். தருமபுரி, சேலம், கோவை மாவட்டங்களுக்கு மிகவும் ஏற்றது.'
    },
    riskLevel: 'safe'
  },
  {
    id: 'crop-guar',
    name: {
      en: 'Cluster Bean (Guar)',
      hi: 'ग्वार (Guar)',
      ta: 'கொத்தவரங்காய் (Cluster Bean)'
    },
    category: 'cash_crop',
    waterRequirement: 'very_low',
    waterRequirementMm: 220,
    season: 'Kharif',
    suitableStates: ['rajasthan'],
    suitableSeverity: ['over-exploited', 'critical', 'semi-critical', 'safe'],
    durationDays: 90,
    irrigationMethod: 'Purely rainfed / Single supplementary drip',
    expectedYieldPerAcre: '6 - 9 Quintals',
    estimatedNetProfitPerAcre: '₹30,000 - ₹45,000',
    suitableSoil: ['Arid sandy', 'Sandy loam'],
    advisoryNote: {
      en: 'High industrial gum demand with lowest water requirement in arid Rajasthan (Barmer, Jodhpur, Bikaner, Jaisalmer).',
      hi: 'शुष्क राजस्थान (बाड़मेर, जैसलमेर, जोधपुर) के लिए सबसे कम पानी वाली और अधिक औद्योगिक मांग वाली फसल।',
      ta: 'வறண்ட நிலங்களுக்கு மிகவும் பொருத்தமான பணப்பயிர்.'
    },
    riskLevel: 'safe'
  },
  {
    id: 'crop-groundnut',
    name: {
      en: 'Groundnut (Peanut)',
      hi: 'मूंगफली (Groundnut)',
      ta: 'நிலக்கடலை (Groundnut)'
    },
    category: 'oilseed',
    waterRequirement: 'medium',
    waterRequirementMm: 500,
    season: 'Kharif',
    suitableStates: ['rajasthan', 'tamil_nadu'],
    suitableSeverity: ['semi-critical', 'safe'],
    durationDays: 115,
    irrigationMethod: 'Sprinkler / Micro-sprinkler',
    expectedYieldPerAcre: '12 - 18 Quintals',
    estimatedNetProfitPerAcre: '₹38,000 - ₹50,000',
    suitableSoil: ['Sandy loam', 'Red sandy', 'Light alluvial'],
    advisoryNote: {
      en: 'Good yield with micro-sprinklers in semi-critical zones. Avoid in over-exploited blocks unless drip irrigation is installed.',
      hi: 'मध्यम भूजल स्तर वाले क्षेत्रों में स्प्रिंकलर से अच्छी पैदावार। अति-दोहित क्षेत्रों में केवल ड्रिप के साथ ही लगाएं।',
      ta: 'சொட்டு நீர் அல்லது தெளிப்பு நீர் பாசனம் மூலம் பயிரிட உகந்தது. நடுத்தர நீர் மட்டத்திற்கு ஏற்றது.'
    },
    riskLevel: 'moderate'
  },
  {
    id: 'crop-cotton',
    name: {
      en: 'Cotton (Kapas)',
      hi: 'कपास (Cotton)',
      ta: 'பருத்தி (Cotton)'
    },
    category: 'cash_crop',
    waterRequirement: 'medium',
    waterRequirementMm: 650,
    season: 'Kharif',
    suitableStates: ['rajasthan', 'tamil_nadu'],
    suitableSeverity: ['semi-critical', 'safe'],
    durationDays: 160,
    irrigationMethod: 'Drip irrigation with fertigation',
    expectedYieldPerAcre: '10 - 15 Quintals',
    estimatedNetProfitPerAcre: '₹45,000 - ₹65,000',
    suitableSoil: ['Deep black soil', 'Medium alluvial', 'Clayey loam'],
    advisoryNote: {
      en: 'Deep-rooted cash crop. Recommended with strict drip irrigation scheduling to prevent groundwater over-draft.',
      hi: 'गहरी जड़ों वाली नकदी फसल। भूजल दोहन रोकने के लिए केवल ड्रिप सिंचाई प्रणाली के साथ ही अनुमोदित।',
      ta: 'சொட்டு நீர் பாசன முறையில் மட்டுமே பயிரிட பரிந்துரைக்கப்படுகிறது.'
    },
    riskLevel: 'moderate'
  },
  {
    id: 'crop-wheat',
    name: {
      en: 'Wheat (Gehun)',
      hi: 'गेहूं (Wheat)',
      ta: 'கோதுமை (Wheat)'
    },
    category: 'cereal',
    waterRequirement: 'medium',
    waterRequirementMm: 550,
    season: 'Rabi',
    suitableStates: ['rajasthan'],
    suitableSeverity: ['semi-critical', 'safe'],
    durationDays: 125,
    irrigationMethod: 'Border strip / Sprinkler (4-5 irrigations)',
    expectedYieldPerAcre: '18 - 24 Quintals',
    estimatedNetProfitPerAcre: '₹35,000 - ₹48,000',
    suitableSoil: ['Alluvial', 'Clay loam'],
    advisoryNote: {
      en: 'Requires 4-5 irrigations. Shift to mustard or chickpeas if local water table is deeper than 35 mbgl to avoid pump failure.',
      hi: '4-5 सिंचाइयों की आवश्यकता। यदि जलस्तर 35 मीटर से अधिक गहरा है, तो गेहूं के स्थान पर सरसों या चना चुनें।',
      ta: 'மிதமான நீர் தேவைப்படும் பயிர்.'
    },
    riskLevel: 'moderate'
  },

  // --- HIGH WATER DEMAND CROPS (HIGH RISK IN DEPLETED ZONES) ---
  {
    id: 'crop-paddy',
    name: {
      en: 'Paddy / Rice (Dhan)',
      hi: 'धान / चावल (Paddy / Rice)',
      ta: 'நெல் (Paddy / Rice)'
    },
    category: 'cereal',
    waterRequirement: 'very_high',
    waterRequirementMm: 1250,
    season: 'Kharif',
    suitableStates: ['tamil_nadu', 'rajasthan'],
    suitableSeverity: ['safe'],
    durationDays: 135,
    irrigationMethod: 'Continuous flooding / System of Rice Intensification (SRI)',
    expectedYieldPerAcre: '24 - 32 Quintals',
    estimatedNetProfitPerAcre: '₹30,000 - ₹42,000',
    suitableSoil: ['Heavy clay', 'Canal alluvium', 'Cauvery delta silt'],
    advisoryNote: {
      en: 'CRITICAL ALERT: Highly water-intensive (>1250mm). STRICTLY DISCOURAGED in Critical/Over-exploited aquifers. Allowed only in safe canal-fed zones (Kota/Cauvery Delta) using SRI/AWD wetting-and-drying methods.',
      hi: 'चेतावनी: भारी जल खपत (>1250mm)। अति-दोहित और क्रिटिकल क्षेत्रों में पूर्णतः वर्जित। केवल सुरक्षित नहरी क्षेत्रों में SRI विधि से ही लगाएं।',
      ta: 'எச்சரிக்கை: அதிக நீர் தேவை (>1250மிமீ). நிலத்தடி நீர் குறைந்த பகுதிகளில் பயிரிடுவதைத் தவிர்க்கவும். காவிரி பாசன பகுதிகளில் மட்டும் நேரடி விதைப்பு முறை பரிந்துரைக்கப்படுகிறது.'
    },
    riskLevel: 'high_risk'
  },
  {
    id: 'crop-sugarcane',
    name: {
      en: 'Sugarcane (Ganna)',
      hi: 'गन्ना (Sugarcane)',
      ta: 'கரும்பு (Sugarcane)'
    },
    category: 'cash_crop',
    waterRequirement: 'very_high',
    waterRequirementMm: 1800,
    season: 'Perennial',
    suitableStates: ['tamil_nadu'],
    suitableSeverity: ['safe'],
    durationDays: 360,
    irrigationMethod: 'Sub-surface drip irrigation mandatory',
    expectedYieldPerAcre: '45 - 60 Tonnes',
    estimatedNetProfitPerAcre: '₹60,000 - ₹90,000',
    suitableSoil: ['Deep fertile loam', 'Clay loam'],
    advisoryNote: {
      en: 'CRITICAL ALERT: Highest water consumer (1800-2200mm). Causes acute groundwater depletion. Prohibited in over-exploited blocks without 100% subsurface drip automation and registered water budget.',
      hi: 'अति-गंभीर चेतावनी: सबसे अधिक जल खपत (1800-2200mm)। भूजल स्तर तेजी से गिराता है। बिना 100% सब-सरफेस ड्रिप के इसकी खेती न करें।',
      ta: 'அதிதீவிர எச்சரிக்கை: மிக அதிக நீர் உறிஞ்சும் பயிர். நிலத்தடி நீர் மட்டம் சீர்குலைய வாய்ப்பு உண்டு. சொட்டு நீர் பாசனம் கட்டாயம்.'
    },
    riskLevel: 'high_risk'
  }
];
