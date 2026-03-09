// frontend/src/pages/plant-identification/PlantDescriptionDetail.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PlantNavbar from '../../components/plant-identification/PlantNavbar';
import { savePlantIdentification } from '../../services/plant-identification/plantApi';

const PLANT_DATABASE = {
  'Gotu Kola': {
    plantId: 'gotu-kola-001', plantName: 'Gotu Kola', scientificName: 'Centella asiatica',
    description: 'Gotu Kola (Centella asiatica) is one of the most revered herbs in Ayurvedic medicine, known as "Mandukparni" in classical texts. This small, creeping herb thrives in tropical wetlands and has been used for thousands of years across South and Southeast Asia. It is celebrated as a powerful brain tonic (medhya rasayana) that enhances memory, concentration, and cognitive function. Gotu Kola is also renowned for its ability to promote wound healing, strengthen connective tissues, and improve circulation. In Sri Lankan traditional medicine, it is a staple green consumed daily for vitality and mental clarity.',
    medicinalUses: ['Enhances memory, focus, and cognitive function','Promotes wound healing and tissue regeneration','Strengthens veins and improves blood circulation','Reduces anxiety, stress, and mental fatigue','Supports skin health and collagen production','Helps heal gastric ulcers','Anti-inflammatory and antioxidant properties','Traditionally used for epilepsy and nervous disorders'],
    ayurvedicProperties: { rasa: 'Bitter (Tikta)', guna: 'Light (Laghu)', virya: 'Cooling (Sheeta)', vipaka: 'Sweet (Madhura)' },
    doshaEffect: 'Balances all three doshas, especially Pitta', partsUsed: ['Whole plant','Leaves','Stems'],
    preparationMethods: ['Fresh leaf sambol (traditional Sri Lankan preparation)','Gotu Kola juice or smoothie','Dried leaf powder in warm milk','Herbal tea or decoction','Medicated oil for topical application'],
    warnings: ['May cause headache or dizziness in high doses','Avoid during pregnancy and breastfeeding','May increase cholesterol levels in some individuals','Can cause skin irritation when applied topically in sensitive people'],
    commonNames: ['Mandukparni','Vallarai','Gotu Kola']
  },
  'Brahmi': {
    plantId: 'brahmi-001', plantName: 'Brahmi', scientificName: 'Bacopa monnieri',
    description: 'Brahmi (Bacopa monnieri) is a legendary nootropic herb that has been a cornerstone of Ayurvedic medicine for over 3,000 years. Named after Lord Brahma, the creator deity in Hinduism, this small aquatic plant is considered one of the most powerful medhya rasayanas (brain tonics) in the Ayurvedic pharmacopoeia. Brahmi contains active compounds called bacosides, which have been scientifically proven to enhance memory, learning ability, and cognitive processing. It is widely used to treat anxiety, depression, ADHD, and age-related cognitive decline. In traditional Sri Lankan medicine, it is known as Lunuwila and is highly valued for mental wellness.',
    medicinalUses: ['Significantly enhances memory and learning capacity','Reduces anxiety and stress (adaptogenic properties)','Supports treatment of ADHD and attention disorders','Protects brain cells from oxidative damage','Improves cognitive function in elderly patients','Anti-epileptic and anticonvulsant properties','Supports healthy sleep patterns','Reduces inflammation throughout the body'],
    ayurvedicProperties: { rasa: 'Bitter (Tikta), Astringent (Kashaya)', guna: 'Light (Laghu)', virya: 'Cooling (Sheeta)', vipaka: 'Sweet (Madhura)' },
    doshaEffect: 'Balances Vata and Pitta doshas', partsUsed: ['Whole plant','Leaves','Stems'],
    preparationMethods: ['Brahmi ghrita (medicated ghee)','Leaf juice with honey','Dried powder in warm milk','Brahmi oil for scalp massage','Herbal tea or decoction','Standardized extract capsules'],
    warnings: ['May cause nausea or stomach upset on empty stomach','Can increase thyroid hormone levels','May cause dry mouth and fatigue initially','Avoid with sedative medications — may enhance drowsiness'],
    commonNames: ['Lunuwila','Nirbrahmi','Jalanimba','Water Hyssop']
  },
  'Shankhpushpi': {
    plantId: 'shankhpushpi-001', plantName: 'Shankhpushpi', scientificName: 'Convolvulus prostratus',
    description: 'Shankhpushpi (Convolvulus prostratus) is a highly esteemed brain tonic in Ayurvedic medicine, named after the conch shell (shankha) due to the shape of its flowers. This perennial herb has been used for centuries to enhance intellect, improve memory, and calm the mind. It is classified as a medhya rasayana and is considered one of the four primary brain-rejuvenating herbs in Ayurveda alongside Brahmi, Mandukaparni, and Jyotishmati. Shankhpushpi is particularly effective for mental clarity, reducing mental fatigue, and supporting nervous system health.',
    medicinalUses: ['Sharpens intellect and improves mental clarity','Enhances memory retention and recall','Reduces anxiety, insomnia, and mental restlessness','Supports healthy nervous system function','Helps manage epilepsy and convulsive disorders','Lowers blood pressure naturally','Supports thyroid function','Useful in managing stress-induced headaches'],
    ayurvedicProperties: { rasa: 'Astringent (Kashaya), Bitter (Tikta)', guna: 'Unctuous (Snigdha)', virya: 'Cooling (Sheeta)', vipaka: 'Sweet (Madhura)' },
    doshaEffect: 'Balances all three doshas (Tridoshahara)', partsUsed: ['Whole plant','Flowers','Leaves','Roots'],
    preparationMethods: ['Shankhpushpi syrup with sugar and honey','Fresh juice of whole plant','Dried powder with warm milk before bed','Medicated ghee (Shankhpushpi Ghrita)','Herbal decoction for calming the mind'],
    warnings: ['May lower blood pressure — caution with antihypertensives','Excessive use may cause sluggishness','Not recommended during pregnancy','May slow down thyroid in high doses'],
    commonNames: ['Katarolu','Shankhini','Vishnukranti','Morning Glory']
  },
  'Holy Basil': {
    plantId: 'tulsi-001', plantName: 'Holy Basil (Tulsi)', scientificName: 'Ocimum tenuiflorum',
    description: 'Holy Basil, known as Tulsi in Sanskrit and Maduruthala in Sinhala, is one of the most sacred and therapeutically versatile plants in Ayurvedic medicine. Revered as "The Queen of Herbs" and "The Incomparable One," Tulsi has been worshipped in Hindu households for thousands of years. This aromatic herb is a powerful adaptogen that helps the body resist physiological, chemical, and psychological stressors. Modern research has validated its antimicrobial, anti-inflammatory, cardioprotective, and immunomodulatory properties. Tulsi is particularly effective for respiratory ailments, stress management, and boosting overall immunity.',
    medicinalUses: ['Powerful adaptogen for stress and anxiety relief','Boosts immunity and fights infections','Relieves respiratory conditions — cough, cold, asthma, bronchitis','Lowers blood sugar and supports diabetes management','Promotes cardiovascular health','Natural anti-inflammatory and pain reliever','Supports oral health and prevents dental diseases','Detoxifies the body and purifies the blood'],
    ayurvedicProperties: { rasa: 'Pungent (Katu), Bitter (Tikta)', guna: 'Light (Laghu), Dry (Ruksha)', virya: 'Heating (Ushna)', vipaka: 'Pungent (Katu)' },
    doshaEffect: 'Balances Vata and Kapha, may increase Pitta in excess', partsUsed: ['Leaves','Seeds','Roots','Whole plant','Essential oil'],
    preparationMethods: ['Tulsi tea — fresh leaves steeped in hot water','Tulsi leaves with honey for coughs','Fresh leaf juice for fever reduction','Dried leaf powder as daily supplement','Tulsi essential oil for aromatherapy','Chewing fresh leaves for oral health'],
    warnings: ['May lower blood sugar — monitor if on diabetes medication','Avoid medicinal doses during pregnancy (may stimulate uterus)','Can slow blood clotting — stop before surgery','May reduce male fertility with prolonged high-dose use'],
    commonNames: ['Tulsi','Maduruthala','Sacred Basil','Vrinda']
  },
  'Giloy': {
    plantId: 'giloy-001', plantName: 'Giloy', scientificName: 'Tinospora cordifolia',
    description: 'Giloy (Tinospora cordifolia), known as Rasakinda in Sinhala, is one of the most important herbs in Ayurvedic medicine. Its Sanskrit name "Guduchi" means "one that protects the body from diseases." This climbing shrub has heart-shaped leaves and has been used for over 5,000 years as a potent immunomodulator and rejuvenative herb. Giloy gained worldwide attention during the COVID-19 pandemic for its powerful immune-boosting properties. It is classified as a Rasayana (rejuvenative) and Medhya (brain tonic) in Ayurveda, making it one of the most versatile herbs for overall health and longevity.',
    medicinalUses: ['Powerful immunomodulator — strengthens the immune system','Reduces chronic and recurrent fevers (Jvarahara)','Detoxifies the blood and liver','Anti-inflammatory — beneficial for arthritis and gout','Helps manage diabetes and blood sugar levels','Improves digestion and treats chronic digestive disorders','Reduces stress and anxiety','Supports respiratory health and treats chronic cough'],
    ayurvedicProperties: { rasa: 'Bitter (Tikta), Astringent (Kashaya)', guna: 'Light (Laghu), Unctuous (Snigdha)', virya: 'Heating (Ushna)', vipaka: 'Sweet (Madhura)' },
    doshaEffect: 'Balances all three doshas (Tridoshahara)', partsUsed: ['Stem','Leaves','Roots','Starch (Guduchi Satva)'],
    preparationMethods: ['Giloy juice extracted from fresh stems','Guduchi Satva (starch extract) with honey','Decoction boiled with water','Giloy powder capsules','Giloy and Tulsi kadha (herbal drink) for immunity','Kashayam (classical decoction) for fevers'],
    warnings: ['May lower blood sugar excessively with diabetes medications','Avoid during pregnancy and breastfeeding','Can cause constipation in some individuals','May stimulate the immune system — caution with autoimmune conditions'],
    commonNames: ['Rasakinda','Guduchi','Amrita','Heart-leaved Moonseed']
  },
  'Amla': {
    plantId: 'amla-001', plantName: 'Amla', scientificName: 'Phyllanthus emblica',
    description: 'Amla (Phyllanthus emblica), known as Nelli in Sinhala, is one of the most important fruits in Ayurvedic medicine. Called "Amalaki" in Sanskrit, meaning "the sustainer," it is considered the richest natural source of Vitamin C, containing 20 times more than oranges. Amla is one of the three fruits in the legendary Triphala formula and is classified as a premier Rasayana (rejuvenative) that promotes longevity, youthfulness, and vitality. This sour, fibrous fruit has been used for over 5,000 years to strengthen immunity, improve digestion, enhance skin and hair health, and support heart function.',
    medicinalUses: ['Exceptionally rich in Vitamin C — powerful immune booster','Promotes hair growth and prevents premature graying','Improves digestion and relieves hyperacidity','Supports cardiovascular health and reduces cholesterol','Enhances skin health, reduces wrinkles and pigmentation','Strengthens bones and teeth','Improves eyesight and protects eye health','Anti-aging Rasayana — promotes longevity and vitality'],
    ayurvedicProperties: { rasa: 'All five tastes except Salty (predominantly Sour)', guna: 'Light (Laghu), Dry (Ruksha)', virya: 'Cooling (Sheeta)', vipaka: 'Sweet (Madhura)' },
    doshaEffect: 'Balances all three doshas (Tridoshahara)', partsUsed: ['Fresh fruit','Dried fruit','Fruit juice','Seeds'],
    preparationMethods: ['Fresh Amla juice on empty stomach','Amla murabba (preserved in sugar syrup)','Dried Amla powder with honey','As part of Triphala churna','Amla oil for hair care','Chyawanprash (Amla-based rejuvenative jam)'],
    warnings: ['May lower blood sugar — monitor with diabetes medications','Excessive intake can cause acidity in sensitive stomachs','May interact with blood-thinning medications','Can cause cold symptoms if consumed in excess during winter'],
    commonNames: ['Nelli','Amalaki','Indian Gooseberry','Dhatri']
  },
  'Ginger': {
    plantId: 'ginger-001', plantName: 'Ginger', scientificName: 'Zingiber officinale',
    description: 'Ginger (Zingiber officinale), known as Inguru in Sinhala, is one of the most widely used medicinal spices in the world and a fundamental herb in Ayurvedic medicine. Called "Vishwabheshaja" in Sanskrit, meaning "universal medicine," ginger has been used for over 5,000 years for its powerful digestive, anti-inflammatory, and warming properties. The rhizome contains bioactive compounds like gingerols and shogaols that provide its therapeutic effects. Fresh ginger (Ardraka) and dried ginger (Shunthi) are used differently in Ayurveda — fresh is preferred for respiratory conditions while dried is stronger for digestive issues.',
    medicinalUses: ['Excellent digestive aid — relieves nausea, bloating, and indigestion','Powerful anti-inflammatory for joint pain and arthritis','Relieves cold, cough, and respiratory congestion','Reduces motion sickness and morning sickness','Improves blood circulation and warms the body','Supports cardiovascular health','Helps manage pain and menstrual cramps','Boosts metabolism and supports healthy weight management'],
    ayurvedicProperties: { rasa: 'Pungent (Katu)', guna: 'Light (Laghu), Unctuous (Snigdha)', virya: 'Heating (Ushna)', vipaka: 'Sweet (Madhura)' },
    doshaEffect: 'Balances Vata and Kapha, may increase Pitta in excess', partsUsed: ['Fresh rhizome','Dried rhizome','Rhizome powder','Juice'],
    preparationMethods: ['Ginger tea with honey and lemon','Fresh ginger juice for nausea relief','Dried ginger powder (Shunthi) in warm water','Ginger paste applied to joints for pain relief','Ginger and turmeric golden milk','Added to cooking for daily digestive support'],
    warnings: ['May cause heartburn or stomach irritation in excess','Avoid large doses before surgery (blood-thinning effects)','Can interact with blood-thinning and diabetes medications','Excessive consumption may worsen acid reflux'],
    commonNames: ['Inguru','Ardraka (fresh)','Shunthi (dry)','Adrak']
  },
  'Fennel': {
    plantId: 'fennel-001', plantName: 'Fennel', scientificName: 'Foeniculum vulgare',
    description: 'Fennel (Foeniculum vulgare), known as Maduru in Sinhala, is a highly aromatic flowering herb that has been an essential part of Ayurvedic medicine for centuries. Called "Shatapushpa" in Sanskrit, meaning "hundred flowers," fennel is one of the most versatile digestive herbs. Its sweet, anise-like flavor makes it a popular culinary spice and after-meal digestive aid across South Asia. Fennel seeds contain anethole, fenchone, and other volatile oils that provide powerful carminative, antispasmodic, and galactagogue properties. It is considered one of the safest and most gentle digestive herbs, suitable even for infants.',
    medicinalUses: ['Relieves bloating, gas, and abdominal discomfort','Improves overall digestion and appetite','Promotes lactation in nursing mothers (galactagogue)','Soothes colic in infants when given as gripe water','Freshens breath and supports oral health','Relieves menstrual cramps and hormonal imbalances','Supports eye health and reduces eye strain','Mild diuretic — supports kidney function'],
    ayurvedicProperties: { rasa: 'Sweet (Madhura), Pungent (Katu)', guna: 'Light (Laghu), Unctuous (Snigdha)', virya: 'Cooling (Sheeta)', vipaka: 'Sweet (Madhura)' },
    doshaEffect: 'Balances all three doshas, especially Vata and Pitta', partsUsed: ['Seeds','Leaves','Bulb','Essential oil'],
    preparationMethods: ['Fennel seed tea (steeped in hot water)','Chewing roasted seeds after meals','Fennel water for infants (gripe water)','Ground seed powder with honey','Fennel essential oil for aromatherapy','Fresh fennel in salads and cooking'],
    warnings: ['May cause allergic reactions in people sensitive to carrot family','Excessive use may have estrogenic effects','Not recommended in large medicinal doses during pregnancy','Can interact with certain antibiotics and blood thinners'],
    commonNames: ['Maduru','Shatapushpa','Saunf','Sweet Fennel']
  },
  'Neem': {
    plantId: 'neem-001', plantName: 'Neem', scientificName: 'Azadirachta indica',
    description: 'Neem (Azadirachta indica), known as Kohomba in Sinhala, is often called the "Village Pharmacy" due to its remarkable range of medicinal applications. This evergreen tree has been a pillar of Ayurvedic medicine for over 4,500 years and is considered one of the most powerful blood-purifying and skin-healing herbs. Every part of the neem tree — leaves, bark, seeds, flowers, and roots — possesses therapeutic properties. Neem contains over 140 active compounds including azadirachtin, nimbin, and nimbidin, which provide its potent antimicrobial, anti-inflammatory, and antiparasitic effects.',
    medicinalUses: ['Powerful blood purifier — treats skin diseases and acne','Strong antimicrobial — fights bacteria, viruses, and fungi','Natural insecticide and antiparasitic','Supports dental health — traditionally used as a toothbrush','Manages diabetes and blood sugar levels','Treats malaria and reduces fever','Supports liver health and detoxification','Anti-inflammatory for arthritis and joint conditions'],
    ayurvedicProperties: { rasa: 'Bitter (Tikta), Astringent (Kashaya)', guna: 'Light (Laghu), Dry (Ruksha)', virya: 'Cooling (Sheeta)', vipaka: 'Pungent (Katu)' },
    doshaEffect: 'Balances Pitta and Kapha, may increase Vata in excess', partsUsed: ['Leaves','Bark','Seeds','Flowers','Fruit','Neem oil','Twigs'],
    preparationMethods: ['Neem leaf paste for skin conditions','Neem water rinse for hair and scalp','Neem oil for topical application','Neem leaf decoction for blood purification','Neem twig as natural toothbrush (datun)','Neem capsules as dietary supplement'],
    warnings: ['Not recommended during pregnancy — may cause miscarriage','Neem oil should NEVER be consumed internally','May lower blood sugar dangerously with diabetes medications','Can reduce fertility in both men and women','Not suitable for infants and young children'],
    commonNames: ['Kohomba','Nimba','Margosa','Indian Lilac']
  },
  'Aloe Vera': {
    plantId: 'aloevera-001', plantName: 'Aloe Vera', scientificName: 'Aloe barbadensis miller',
    description: 'Aloe Vera (Aloe barbadensis miller), known as Komarika in Sinhala, is one of the most widely recognized medicinal plants in the world. This succulent plant has thick, fleshy leaves filled with a transparent gel that has been used for thousands of years across multiple civilizations including Ayurvedic, Egyptian, Greek, and Chinese medicine. Called "Kumari" in Sanskrit, meaning "young girl," Aloe Vera is believed to bestow youthfulness and beauty. It contains over 200 biologically active compounds including vitamins, minerals, amino acids, enzymes, and polysaccharides.',
    medicinalUses: ['Soothes burns, sunburns, and skin irritations','Promotes wound healing and tissue repair','Supports digestive health and relieves constipation','Moisturizes and rejuvenates skin naturally','Helps manage blood sugar levels','Boosts immunity with antioxidant compounds','Reduces dental plaque and oral infections','Anti-inflammatory properties for joint pain relief'],
    ayurvedicProperties: { rasa: 'Bitter (Tikta), Sweet (Madhura)', guna: 'Heavy (Guru), Unctuous (Snigdha)', virya: 'Cooling (Sheeta)', vipaka: 'Sweet (Madhura)' },
    doshaEffect: 'Balances Pitta and Kapha doshas', partsUsed: ['Leaf gel','Leaf latex','Whole leaf'],
    preparationMethods: ['Fresh gel applied topically for skin conditions','Aloe juice for internal digestive support','Gel mixed with turmeric for wound healing','Aloe pulp blended into smoothies','Dried powder (Kumari Churna) for supplements'],
    warnings: ['Aloe latex may cause cramping and diarrhea','Not recommended internally during pregnancy','May interact with diabetes and heart medications','Topical use may cause sensitivity in some individuals'],
    commonNames: ['Kumari','Komarika','Ghritkumari','Kathalai']
  },
  'Bhringraj': {
    plantId: 'bhringraj-001', plantName: 'Bhringraj', scientificName: 'Eclipta alba',
    description: 'Bhringraj (Eclipta alba), known as Kikirindiya in Sinhala, is revered as the "King of Herbs for Hair" in Ayurvedic medicine. This small, creeping herb belongs to the sunflower family and has been used for thousands of years to promote luxurious hair growth, prevent premature graying, and treat baldness. Beyond hair care, Bhringraj is a powerful Rasayana (rejuvenative) that supports liver health, improves skin complexion, and strengthens the nervous system. In classical Ayurvedic texts, Bhringraj is described as one of the finest herbs for maintaining youthful appearance and vitality.',
    medicinalUses: ['Premier herb for hair growth and preventing hair loss','Prevents premature graying of hair','Powerful liver tonic and hepatoprotective herb','Improves skin complexion and treats skin disorders','Supports eye health and vision','Calms the mind and promotes restful sleep','Anti-inflammatory for joint and muscle pain','Strengthens teeth and gums'],
    ayurvedicProperties: { rasa: 'Bitter (Tikta), Pungent (Katu)', guna: 'Light (Laghu), Dry (Ruksha)', virya: 'Heating (Ushna)', vipaka: 'Pungent (Katu)' },
    doshaEffect: 'Balances Vata and Kapha doshas', partsUsed: ['Whole plant','Leaves','Seeds','Roots','Oil extracted from plant'],
    preparationMethods: ['Bhringraj oil for scalp massage','Fresh leaf juice applied to scalp','Bhringraj powder mixed with coconut oil','Leaf decoction for internal use','Bhringraj churna (powder) with honey','Hair masks with Bhringraj, Amla, and Brahmi'],
    warnings: ['May cause cold-like symptoms in Kapha-dominant individuals','Avoid excessive internal use during pregnancy','Can cause drowsiness in some individuals','May interact with diabetes and thyroid medications'],
    commonNames: ['Kikirindiya','Kesharaja','False Daisy','Bhringaraja']
  },
  'Sandalwood': {
    plantId: 'sandalwood-001', plantName: 'Sandalwood', scientificName: 'Santalum album',
    description: 'Sandalwood (Santalum album), known as Sudu Handun in Sinhala, is one of the most precious and sacred trees in Ayurvedic tradition. This slow-growing evergreen tree produces heartwood with an exquisitely fragrant essential oil that has been prized for millennia in medicine, perfumery, and spiritual practices. In Ayurveda, Sandalwood is classified as one of the most cooling and soothing herbs, making it exceptionally effective for inflammatory skin conditions, fevers, and Pitta-related disorders. Its essential oil contains alpha-santalol, which provides powerful anti-inflammatory, antimicrobial, and calming effects.',
    medicinalUses: ['Cooling and soothing for skin inflammation and rashes','Reduces fevers and body heat','Promotes mental calmness and aids meditation','Treats urinary tract infections and burning sensation','Improves skin complexion and reduces blemishes','Relieves headaches and migraine','Natural perfume and deodorant','Supports management of anxiety and insomnia'],
    ayurvedicProperties: { rasa: 'Bitter (Tikta), Sweet (Madhura)', guna: 'Light (Laghu), Dry (Ruksha)', virya: 'Cooling (Sheeta)', vipaka: 'Pungent (Katu)' },
    doshaEffect: 'Balances Pitta and Vata doshas', partsUsed: ['Heartwood','Essential oil','Sandalwood paste','Powder'],
    preparationMethods: ['Sandalwood paste applied to skin and forehead','Essential oil diluted for aromatherapy','Sandalwood water as cooling tonic','Paste mixed with rose water for skincare','Sandalwood milk for internal cooling','Chandanasava (fermented sandalwood preparation)'],
    warnings: ['May cause skin irritation in sensitive individuals','Avoid applying undiluted essential oil directly','Not recommended for long-term internal use without guidance','Pregnant women should avoid medicinal doses'],
    commonNames: ['Sudu Handun','Chandana','Srigandha','White Sandalwood']
  },
  'Turmeric': {
    plantId: 'turmeric-001', plantName: 'Turmeric', scientificName: 'Curcuma longa',
    description: 'Turmeric (Curcuma longa), known as Kaha in Sinhala, is a golden-colored flowering plant of the ginger family native to the Indian subcontinent. Its rhizome contains curcumin, one of the most extensively researched natural compounds in modern science with over 12,000 published studies. Known as "Haridra" in Sanskrit and revered as the "Golden Goddess," Turmeric has been a cornerstone of Ayurvedic medicine for over 4,000 years. It is one of the most versatile healing herbs known, with powerful anti-inflammatory, antioxidant, antimicrobial, and anticancer properties.',
    medicinalUses: ['Potent anti-inflammatory — helps manage arthritis and joint pain','Strong antioxidant — neutralizes free radicals','Supports brain health and may prevent neurodegenerative diseases','Promotes cardiovascular health','Aids wound healing when applied topically','Supports liver function and natural detoxification','Helps manage blood sugar levels','Enhances skin health and promotes glow','Boosts immunity and fights infections'],
    ayurvedicProperties: { rasa: 'Bitter (Tikta), Pungent (Katu)', guna: 'Light (Laghu), Dry (Ruksha)', virya: 'Heating (Ushna)', vipaka: 'Pungent (Katu)' },
    doshaEffect: 'Balances all three doshas (Tridoshahara), especially Kapha', partsUsed: ['Rhizome (fresh)','Dried rhizome powder','Leaves'],
    preparationMethods: ['Golden milk — turmeric with warm milk and black pepper','Turmeric paste for wounds and skin conditions','Turmeric tea with ginger and honey','Haldi water on empty stomach','Curcumin extract capsules','Turmeric in daily cooking'],
    warnings: ['May increase bleeding risk with blood-thinning medications','High doses can cause stomach upset','May lower blood sugar — monitor if diabetic','Avoid medicinal doses during pregnancy','Can aggravate gallbladder conditions'],
    commonNames: ['Kaha','Haldi','Haridra','Manjal','Pasupu']
  },
  'Arjuna': {
    plantId: 'arjuna-001', plantName: 'Arjuna', scientificName: 'Terminalia arjuna',
    description: "Arjuna (Terminalia arjuna), known as Kumbuk in Sinhala, is the premier heart-protective herb in Ayurvedic medicine. This large deciduous tree is commonly found along riverbanks across the Indian subcontinent and Sri Lanka. Named after the heroic warrior prince Arjuna from the Mahabharata, this tree's bark has been used for over 3,000 years to strengthen the heart muscle, regulate blood pressure, and treat cardiovascular conditions. Modern research has confirmed that Arjuna bark contains arjunolic acid, arjunetin, and potent flavonoids that provide significant cardioprotective benefits.",
    medicinalUses: ['Strengthens heart muscles and improves cardiac function','Regulates blood pressure (both high and low)','Reduces LDL cholesterol and triglycerides','Supports recovery after heart attacks','Anti-anginal — reduces chest pain','Promotes wound healing and skin health','Mild diuretic — reduces water retention','Useful in managing respiratory conditions like asthma'],
    ayurvedicProperties: { rasa: 'Astringent (Kashaya)', guna: 'Light (Laghu), Dry (Ruksha)', virya: 'Cooling (Sheeta)', vipaka: 'Pungent (Katu)' },
    doshaEffect: 'Balances Pitta and Kapha doshas', partsUsed: ['Tree bark','Leaves','Fruit','Bark powder'],
    preparationMethods: ['Arjuna bark powder with warm milk (Arjuna Ksheerapaka)','Bark decoction for heart health','Arjunarishta (fermented bark preparation)','Bark powder with honey','Arjuna tea — bark steeped in hot water','Capsules of standardized bark extract'],
    warnings: ['May lower blood pressure — caution with antihypertensives','Can interact with cardiac medications','Not recommended during pregnancy without medical guidance','May cause constipation in some individuals'],
    commonNames: ['Kumbuk','Arjun','Nadisarja','White Marudah']
  },
  'Vasaka': {
    plantId: 'vasaka-001', plantName: 'Vasaka', scientificName: 'Adhatoda vasica',
    description: "Vasaka (Adhatoda vasica), known as Adathoda in Sinhala, is the foremost respiratory herb in Ayurvedic medicine. This dense evergreen shrub has been used for over 2,000 years to treat all types of respiratory ailments including cough, bronchitis, asthma, and tuberculosis. The leaves contain vasicine (an alkaloid), which has been the basis for the development of modern pharmaceutical expectorant drugs like bromhexine. In Ayurveda, Vasaka is considered the most effective herb for clearing respiratory passages, liquefying mucus, and reducing inflammation of the bronchial tubes.",
    medicinalUses: ['Premier treatment for cough and bronchitis','Relieves asthma symptoms and bronchospasm','Powerful expectorant — loosens and expels mucus','Stops bleeding (hemostatic) — treats nosebleeds and bleeding gums','Anti-inflammatory for respiratory passages','Useful in treating tuberculosis symptoms','Supports management of allergic rhinitis','Mild antimicrobial for respiratory infections'],
    ayurvedicProperties: { rasa: 'Bitter (Tikta), Astringent (Kashaya)', guna: 'Light (Laghu), Dry (Ruksha)', virya: 'Cooling (Sheeta)', vipaka: 'Pungent (Katu)' },
    doshaEffect: 'Balances Pitta and Kapha doshas', partsUsed: ['Leaves','Flowers','Roots','Bark'],
    preparationMethods: ['Vasaka leaf juice with honey for cough','Leaf decoction for bronchitis','Vasa Avaleha (herbal jam) for chronic cough','Dried leaf powder as supplement','Fresh leaf paste for wound healing','Vasarishtam (fermented preparation)'],
    warnings: ['Not recommended during pregnancy (may stimulate uterus)','May cause nausea in high doses','Can lower blood pressure','Not suitable for people with bleeding disorders without guidance'],
    commonNames: ['Adathoda','Adulsa','Vasa','Malabar Nut']
  },
  'Aralu': {
    plantId: 'aralu-001', plantName: 'Aralu', scientificName: 'Terminalia chebula',
    description: "Aralu (Terminalia chebula), known as Haritaki in Sanskrit, is one of the most revered herbs in both Ayurvedic and Tibetan medicine. Called the 'King of Medicines' in Tibet, this fruit is one of the three components of the legendary Triphala formula. In Sri Lankan traditional medicine, Aralu holds a place of supreme importance as a powerful detoxifier, digestive tonic, and rejuvenative. The dried fruit is said to possess all five tastes (pancharasa) except salty, making it a uniquely balancing herb. Ancient texts state that Haritaki can cure all diseases and is as nurturing as a mother.",
    medicinalUses: ['Powerful detoxifier and body cleanser','Excellent digestive tonic — relieves constipation naturally','Key ingredient in Triphala — the famous rejuvenative formula','Supports cardiovascular health and reduces cholesterol','Anti-inflammatory and wound healing properties','Improves memory and cognitive function','Supports eye health and treats eye disorders','Strengthens immunity and promotes longevity'],
    ayurvedicProperties: { rasa: 'All five tastes except Salty (predominantly Astringent)', guna: 'Light (Laghu), Dry (Ruksha)', virya: 'Heating (Ushna)', vipaka: 'Sweet (Madhura)' },
    doshaEffect: 'Balances all three doshas (Tridoshahara), especially Vata', partsUsed: ['Dried fruit','Fruit pulp','Seed','Bark'],
    preparationMethods: ['Aralu fruit powder with warm water before bed','As part of Triphala churna (with Bulu and Nelli)','Haritaki powder with ghee for rejuvenation','Decoction for digestive issues','Aralu fruit powder with honey for cough','Triphala eye wash for eye health'],
    warnings: ['Not recommended during pregnancy','Avoid during severe dehydration or emaciation','May cause loose stools in high doses','Not suitable during acute diarrhea or dysentery'],
    commonNames: ['Aralu','Haritaki','Chebulic Myrobalan','Kadukkai']
  },
  'Bulu': {
    plantId: 'bulu-001', plantName: 'Bulu', scientificName: 'Terminalia bellirica',
    description: "Bulu (Terminalia bellirica), known as Vibhitaki in Sanskrit, is the second of the three fruits that compose the famous Triphala formula. This large deciduous tree is native to South and Southeast Asia and has been an integral part of Ayurvedic medicine for thousands of years. Bulu is especially valued for its remarkable effects on the respiratory and digestive systems. The name 'Vibhitaki' means 'devoid of fear of disease,' reflecting the herb's broad-spectrum healing properties. It is classified as a powerful Rasayana (rejuvenative) that particularly targets Kapha-related disorders.",
    medicinalUses: ['Key component of Triphala — the classic rejuvenative formula','Excellent for respiratory conditions — cough, bronchitis, asthma','Supports healthy digestion and treats constipation','Promotes hair health and prevents premature graying','Improves voice quality and treats hoarseness','Anti-parasitic — helps eliminate intestinal worms','Supports eye health and vision','Reduces cholesterol and supports heart health'],
    ayurvedicProperties: { rasa: 'Astringent (Kashaya)', guna: 'Light (Laghu), Dry (Ruksha)', virya: 'Heating (Ushna)', vipaka: 'Sweet (Madhura)' },
    doshaEffect: 'Balances all three doshas, especially Kapha', partsUsed: ['Dried fruit','Fruit pulp','Seed','Bark','Seed oil'],
    preparationMethods: ['Bulu fruit powder with warm water','As part of Triphala churna (with Aralu and Nelli)','Bulu powder with honey for respiratory issues','Decoction for sore throat and cough','Oil extracted from seeds for hair care','Powder gargle for throat infections'],
    warnings: ['Not recommended during pregnancy','May cause bloating in some individuals initially','Avoid during acute diarrhea','High doses may lead to dehydration'],
    commonNames: ['Bulu','Vibhitaki','Belliric Myrobalan','Baheda']
  },
  'Cinnamon': {
    plantId: 'cinnamon-001', plantName: 'Cinnamon', scientificName: 'Cinnamomum verum',
    description: "Cinnamon (Cinnamomum verum), known as Kurundu in Sinhala, is one of the most valuable spices in the world and Sri Lanka's pride as the original source of true Ceylon Cinnamon. Unlike the common Cassia cinnamon, Ceylon Cinnamon (Cinnamomum verum) is considered superior in both flavor and medicinal quality with significantly lower coumarin content. Known as 'Tvak' in Ayurveda, cinnamon has been used for over 4,000 years as a culinary spice and a powerful medicinal herb. Sri Lanka currently produces over 80% of the world's true cinnamon.",
    medicinalUses: ['Regulates blood sugar levels and improves insulin sensitivity','Powerful anti-inflammatory and antioxidant properties','Supports cardiovascular health and reduces cholesterol','Aids digestion and relieves bloating','Natural antimicrobial — fights bacterial and fungal infections','Improves brain function and cognitive performance','Helps relieve respiratory conditions and cold symptoms','Supports oral health and freshens breath'],
    ayurvedicProperties: { rasa: 'Pungent (Katu), Sweet (Madhura)', guna: 'Light (Laghu), Dry (Ruksha), Sharp (Tikshna)', virya: 'Heating (Ushna)', vipaka: 'Sweet (Madhura)' },
    doshaEffect: 'Balances Vata and Kapha, may increase Pitta in excess', partsUsed: ['Inner bark','Leaves','Essential oil','Bark powder'],
    preparationMethods: ['Cinnamon tea or decoction with honey','Powdered bark in warm milk (golden milk)','Essential oil for aromatherapy','Bark infusion for digestive remedy','Cinnamon water for blood sugar management'],
    warnings: ['Cassia cinnamon contains high coumarin — prefer Ceylon variety','May lower blood sugar excessively with diabetes medications','Avoid large medicinal doses during pregnancy','Can cause mouth sores or allergic reactions in sensitive individuals'],
    commonNames: ['Kurundu','Tvak','Dalchini','Ceylon Cinnamon']
  },
  'Cardamom': {
    plantId: 'cardamom-001', plantName: 'Cardamom', scientificName: 'Elettaria cardamomum',
    description: "Cardamom (Elettaria cardamomum), known as Enasal in Sinhala, is revered as the 'Queen of Spices' and is one of the most valuable spice crops in the world. This aromatic member of the ginger family has been used in Ayurvedic medicine for over 3,000 years as a powerful digestive aid, respiratory remedy, and detoxifier. Known as 'Ela' in Sanskrit, Cardamom possesses a unique combination of warming and cooling properties that make it remarkably versatile. The green pods contain tiny black seeds rich in essential oils, primarily cineole, which provides the characteristic refreshing aroma.",
    medicinalUses: ['Excellent digestive aid — relieves bloating, gas, and nausea','Freshens breath and supports oral health','Detoxifies the body and purifies the blood','Relieves respiratory congestion and cough','Helps manage blood pressure','Supports urinary health and acts as a mild diuretic','Reduces acidity and heartburn','Anti-depressant and mood-enhancing properties'],
    ayurvedicProperties: { rasa: 'Pungent (Katu), Sweet (Madhura)', guna: 'Light (Laghu), Dry (Ruksha)', virya: 'Cooling (Sheeta)', vipaka: 'Sweet (Madhura)' },
    doshaEffect: 'Balances all three doshas (Tridoshahara)', partsUsed: ['Seeds','Pods','Essential oil','Seed powder'],
    preparationMethods: ['Cardamom tea — crushed pods in hot water','Chewing pods for fresh breath and digestion','Ground cardamom in warm milk','Added to coffee or chai for flavor and benefits','Cardamom powder with honey for cough','Essential oil for aromatherapy and massage'],
    warnings: ['May trigger gallstone symptoms in susceptible individuals','Avoid large medicinal doses during pregnancy','Can lower blood pressure — caution with antihypertensives','May cause allergic reactions in sensitive individuals'],
    commonNames: ['Enasal','Ela','Elaichi','Green Cardamom']
  },
  'Black Pepper': {
    plantId: 'black-pepper-001', plantName: 'Black Pepper', scientificName: 'Piper nigrum',
    description: "Black Pepper (Piper nigrum), known as Gammiris in Sinhala, is called the 'King of Spices' and has been one of the most valuable trade commodities in human history. This climbing vine is native to South India and Sri Lanka and has been a fundamental ingredient in Ayurvedic medicine for over 4,000 years. Known as 'Maricha' in Sanskrit (meaning 'the sun'), Black Pepper contains piperine, a powerful bioactive compound that enhances the bioavailability and absorption of other nutrients and herbs — most notably increasing curcumin absorption by up to 2,000%. In Ayurveda, it is a key component of the famous 'Trikatu' formula.",
    medicinalUses: ['Dramatically enhances nutrient absorption (bioavailability enhancer)','Stimulates digestive fire (Agni) and improves digestion','Relieves cold, cough, and respiratory congestion','Powerful antioxidant that fights free radicals','Supports weight management by boosting metabolism','Anti-inflammatory for joint pain and arthritis','Improves brain function and mental clarity','Supports liver health and detoxification'],
    ayurvedicProperties: { rasa: 'Pungent (Katu)', guna: 'Light (Laghu), Dry (Ruksha), Sharp (Tikshna)', virya: 'Heating (Ushna)', vipaka: 'Pungent (Katu)' },
    doshaEffect: 'Balances Vata and Kapha, increases Pitta', partsUsed: ['Dried berries (peppercorns)','Fresh berries','Essential oil'],
    preparationMethods: ['Trikatu churna (with ginger and long pepper)','Black pepper with honey for cough and cold','Pepper-turmeric milk (enhanced golden milk)','Ground pepper in daily cooking','Pepper water (Jeerakarishta) for digestion','Pepper essential oil for topical pain relief'],
    warnings: ['May cause stomach irritation in excess','Avoid large doses with blood-thinning medications','Can increase absorption of medications — consult doctor','May worsen acid reflux and ulcers in Pitta-dominant individuals'],
    commonNames: ['Gammiris','Maricha','Kali Mirch','Peppercorn']
  },
  'Iramusu': {
    plantId: 'iramusu-001', plantName: 'Iramusu', scientificName: 'Hemidesmus indicus',
    description: "Iramusu (Hemidesmus indicus), also known as Indian Sarsaparilla, is one of the most important blood-purifying herbs in both Ayurvedic and Sri Lankan traditional medicine. This slender climbing plant has fragrant roots with a distinctive vanilla-like aroma and has been used for centuries to treat skin diseases, urinary disorders, and blood impurities. Known as 'Anantamula' in Sanskrit (meaning 'the endless root'), Iramusu is classified as a premier Raktashodhaka (blood purifier) in Ayurveda. In Sri Lanka, the refreshing Iramusu drink made from its roots is a beloved traditional beverage consumed for its cooling properties.",
    medicinalUses: ['Premier blood purifier — treats skin diseases and acne','Cooling herb — reduces body heat and burning sensation','Supports urinary health and treats urinary tract infections','Detoxifies the body and liver','Anti-inflammatory for joint pain and arthritis','Improves skin complexion and treats eczema','Useful in managing respiratory conditions','Strengthens immunity and promotes general wellness'],
    ayurvedicProperties: { rasa: 'Sweet (Madhura), Bitter (Tikta)', guna: 'Heavy (Guru), Unctuous (Snigdha)', virya: 'Cooling (Sheeta)', vipaka: 'Sweet (Madhura)' },
    doshaEffect: 'Balances all three doshas, especially Pitta', partsUsed: ['Roots','Root bark','Whole plant'],
    preparationMethods: ['Traditional Iramusu drink — root decoction with sugar','Root decoction for blood purification','Root powder with warm milk','Medicated oil from roots for skin application','Cold infusion of roots for cooling effect','Iramusu syrup as daily tonic'],
    warnings: ['Generally very safe with few side effects','May slow blood clotting in susceptible individuals','Avoid large medicinal doses during pregnancy','May cause mild digestive upset in sensitive stomachs'],
    commonNames: ['Iramusu','Anantamula','Indian Sarsaparilla','Naruneendi']
  },
  'Ranawara': {
    plantId: 'ranawara-001', plantName: 'Ranawara', scientificName: 'Cassia auriculata',
    description: "Ranawara (Cassia auriculata) is one of the most cherished traditional herbs in Sri Lankan medicine and Ayurveda. This beautiful flowering shrub produces bright yellow flowers that are dried and used to make the popular Ranawara tea — a staple health beverage in many Sri Lankan households. Known as 'Avaram' in Sanskrit, Ranawara has been used for centuries for its remarkable ability to manage blood sugar levels, promote radiant skin, and support overall metabolic health. Scientific studies have confirmed its hypoglycemic, antioxidant, and hepatoprotective effects.",
    medicinalUses: ['Helps manage blood sugar levels and supports diabetes care','Promotes clear, glowing skin and treats skin disorders','Rich in antioxidants that fight aging','Supports liver health and detoxification','Helps manage weight and reduces body fat','Reduces cholesterol and supports heart health','Natural remedy for urinary tract infections','Anti-inflammatory for respiratory conditions'],
    ayurvedicProperties: { rasa: 'Bitter (Tikta), Astringent (Kashaya)', guna: 'Light (Laghu), Dry (Ruksha)', virya: 'Cooling (Sheeta)', vipaka: 'Pungent (Katu)' },
    doshaEffect: 'Balances Pitta and Kapha doshas', partsUsed: ['Flowers','Leaves','Bark','Seeds','Roots'],
    preparationMethods: ["Ranawara flower tea — Sri Lanka's traditional health tea",'Dried flower decoction for blood sugar management','Flower paste applied to skin for complexion','Bark decoction for digestive disorders','Ranawara tea with cinnamon for enhanced benefits','Leaf paste for wound healing'],
    warnings: ['May lower blood sugar significantly — monitor with diabetes medications','Can cause loose stools in some individuals','Avoid excessive consumption during pregnancy','May interact with liver-metabolized medications'],
    commonNames: ['Ranawara','Avaram','Tangedu','Senna auriculata']
  },
  'Polpala': {
    plantId: 'polpala-001', plantName: 'Polpala', scientificName: 'Aerva lanata',
    description: "Polpala (Aerva lanata) is one of the most significant herbs in Sri Lankan traditional medicine and is considered a national treasure for kidney and urinary health. This small, woolly herb grows abundantly in Sri Lanka and is called 'Pashanabheda' in Sanskrit, meaning 'stone-breaker,' reflecting its primary use in dissolving kidney stones. Polpala has been used for generations by Sri Lankan traditional healers (Veda Mahattayas) as a powerful diuretic and lithotriptic (stone-dissolving) herb. Beyond kidney health, Polpala is valued for its anti-inflammatory, hepatoprotective, and antimicrobial properties.",
    medicinalUses: ['Premier herb for dissolving and preventing kidney stones','Powerful natural diuretic — supports healthy urination','Treats urinary tract infections and burning urination','Supports liver health and reduces hepatic inflammation','Anti-inflammatory for joint and body pain','Helps manage cough and respiratory conditions','Supports blood sugar management','Reduces body heat and treats skin conditions'],
    ayurvedicProperties: { rasa: 'Bitter (Tikta), Sweet (Madhura)', guna: 'Light (Laghu), Dry (Ruksha)', virya: 'Cooling (Sheeta)', vipaka: 'Sweet (Madhura)' },
    doshaEffect: 'Balances Pitta and Kapha doshas', partsUsed: ['Whole plant','Roots','Leaves','Flowers'],
    preparationMethods: ['Polpala herbal tea — boiled plant decoction','Fresh plant juice for kidney stone treatment','Dried plant powder with warm water','Root decoction for urinary disorders','Polpala Kashaya (concentrated herbal extract)','Combined with Iramusu for enhanced kidney support'],
    warnings: ['May cause excessive urination — stay well hydrated','Can lower blood pressure in susceptible individuals','Avoid medicinal doses during pregnancy','May interact with diuretic and blood pressure medications'],
    commonNames: ['Polpala','Pashanabheda','Mountain Knotgrass','Bhadra']
  },
  'Hathawariya': {
    plantId: 'hathawariya-001', plantName: 'Hathawariya', scientificName: 'Asparagus racemosus',
    description: "Hathawariya (Asparagus racemosus), commonly known as Shatavari, is one of the most important herbs in Ayurvedic medicine, revered as the 'Queen of Herbs.' Its name means 'she who possesses a hundred husbands,' indicating its powerful rejuvenative effects on the female reproductive system. This climbing plant with pine needle-like phylloclades is a powerful adaptogen and Rasayana that has been used for thousands of years in both Ayurvedic and Sri Lankan traditional medicine. Hathawariya is particularly valued for supporting female health across all life stages — from menstruation through menopause.",
    medicinalUses: ['Premier female reproductive tonic — supports fertility and hormonal balance','Powerful adaptogen that helps the body cope with stress','Boosts immunity and strengthens the immune system','Improves digestive health and heals gastric ulcers','Galactagogue — promotes lactation in nursing mothers','Anti-aging and rejuvenative properties (Rasayana)','Supports urinary tract health','Nourishes and strengthens the nervous system'],
    ayurvedicProperties: { rasa: 'Sweet (Madhura), Bitter (Tikta)', guna: 'Heavy (Guru), Unctuous (Snigdha)', virya: 'Cooling (Sheeta)', vipaka: 'Sweet (Madhura)' },
    doshaEffect: 'Balances Vata and Pitta doshas', partsUsed: ['Tuberous roots','Leaves','Whole plant'],
    preparationMethods: ['Root powder mixed with warm milk and honey','Shatavari Ghrita (medicated ghee preparation)','Decoction of dried roots for digestive support','Root powder capsules as daily supplement','Fresh root juice for reproductive health'],
    warnings: ['Avoid if allergic to asparagus family plants','Consult physician if on hormonal medications','May cause weight gain due to nourishing quality','Not recommended during active respiratory congestion'],
    commonNames: ['Shatavari','Hathawariya','Satamuli','Kilavari']
  },
  'Papaya': {
    plantId: 'papaya-001', plantName: 'Papaya', scientificName: 'Carica papaya',
    description: 'Papaya (Carica papaya), known as Gaslabu in Sinhala, is a tropical fruit-bearing plant native to Central America that is now cultivated worldwide in tropical and subtropical regions. Every part of the papaya plant — fruit, leaves, seeds, latex, and bark — possesses remarkable therapeutic applications in traditional medicine. The fruit is exceptionally rich in papain, a powerful proteolytic enzyme that aids digestion and has anti-inflammatory properties. Papaya leaves gained worldwide attention for their ability to increase platelet counts in dengue fever patients.',
    medicinalUses: ['Increases platelet count — widely used in dengue treatment','Excellent digestive aid due to the enzyme papain','Rich in Vitamin C and antioxidants for immune support','Anti-inflammatory properties reduce swelling and pain','Promotes wound healing and skin health','Supports cardiovascular health and reduces cholesterol','Anti-parasitic — seeds help eliminate intestinal worms','Leaf extract supports liver health and detoxification'],
    ayurvedicProperties: { rasa: 'Sweet (Madhura), slightly Pungent (Katu)', guna: 'Light (Laghu), Soft (Mridu)', virya: 'Heating (Ushna)', vipaka: 'Sweet (Madhura)' },
    doshaEffect: 'Balances Vata and Kapha, may slightly increase Pitta', partsUsed: ['Ripe fruit','Unripe fruit','Leaves','Seeds','Latex'],
    preparationMethods: ['Fresh ripe fruit consumed directly for nutrition','Leaf juice extract for boosting platelet count','Papaya enzyme supplements for digestion','Seed powder as anti-parasitic remedy','Leaf tea for liver support'],
    warnings: ['Unripe papaya must be AVOIDED during pregnancy','Papaya latex can cause allergic reactions','May interact with blood-thinning medications','Seeds in high doses may affect male fertility'],
    commonNames: ['Gaslabu','Papita','Pappali','Erandakarkati']
  }
};

const PlantDescriptionDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const { result, image } = location.state || {};

  const getPlantDetails = (plantName) => {
    if (!plantName) return null;
    if (PLANT_DATABASE[plantName]) return PLANT_DATABASE[plantName];
    const baseName = plantName.replace(/\s*\(.*\)$/, '').trim();
    if (PLANT_DATABASE[baseName]) return PLANT_DATABASE[baseName];
    const key = Object.keys(PLANT_DATABASE).find(k => k.toLowerCase() === baseName.toLowerCase());
    return key ? PLANT_DATABASE[key] : null;
  };

  const plantDetails = getPlantDetails(result?.plantName);
  const displayResult = plantDetails ? { ...plantDetails, confidence: result?.confidence || 0, scientificName: plantDetails.scientificName || result?.scientificName } : result;
  const displayImage = image || null;

  useEffect(() => {
    if (displayResult) {
      const recentPlants = JSON.parse(localStorage.getItem('recentPlants') || '[]');
      const plantEntry = { plantId: displayResult.plantId, plantName: displayResult.plantName, scientificName: displayResult.scientificName, viewedAt: new Date().toISOString() };
      const filtered = recentPlants.filter(p => p.plantId !== plantEntry.plantId);
      localStorage.setItem('recentPlants', JSON.stringify([plantEntry, ...filtered].slice(0, 10)));
    }
  }, [displayResult]);

  const handleSaveToHistory = async () => {
    setSaving(true);
    try {
      await savePlantIdentification({ plantName: displayResult.plantName, scientificName: displayResult.scientificName, confidence: displayResult.confidence, image: displayImage, identifiedAt: new Date().toISOString(), ...displayResult });
      setSaved(true);
      setTimeout(() => navigate('/plant-history'), 1500);
    } catch (error) {
      console.error('Failed to save identification:', error);
      alert('Failed to save to history. Please try again.');
      setSaving(false);
    }
  };

  if (!displayResult) {
    return (
      <>
        <PlantNavbar />
        <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] via-white to-[#f0fdf4] flex items-center justify-center">
          <div className="bg-white rounded-2xl p-10 shadow-lg border border-gray-100 text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Plant Data</h2>
            <p className="text-sm text-gray-500 mb-6">Please scan a plant first to see its details.</p>
            <button onClick={() => navigate('/plant-scan')} className="px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors">
              Go to Plant Scan
            </button>
          </div>
        </div>
      </>
    );
  }

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'medicinal', label: 'Medicinal Uses' },
    { key: 'ayurvedic', label: 'Ayurvedic Properties' },
    { key: 'safety', label: 'Safety & Warnings' },
  ];

  return (
    <>
      <PlantNavbar />
      <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] via-white to-[#f0fdf4]">
        <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16">
          {/* Header */}
          <div className="text-center mb-10">
            <p className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full mb-4">
              Plant Details
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              {displayResult.plantName}
            </h1>
            <p className="mt-2 text-base sm:text-lg text-gray-400 italic">{displayResult.scientificName}</p>
            {displayResult.doshaEffect && (
              <span className="inline-block mt-3 px-4 py-1.5 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold border border-purple-100">
                {displayResult.doshaEffect}
              </span>
            )}
          </div>

          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Content */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Plant Image - Now on the left side */}
              {displayImage && (
                <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
                  <img src={displayImage} alt={displayResult.plantName} className="w-full h-auto max-h-[400px] object-cover rounded-xl" />
                </div>
              )}

              {/* Tab Navigation */}
              <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
                {tabs.map((tab) => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all ${activeTab === tab.key ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <>
                  {displayResult.description && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                        About This Plant
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{displayResult.description}</p>
                    </div>
                  )}
                  {displayResult.partsUsed?.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                        Parts Used
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {displayResult.partsUsed.map((part, i) => (
                          <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-100">{part}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {displayResult.commonNames?.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg>
                        Common Names
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {displayResult.commonNames.map((name, i) => (
                          <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100">{name}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Medicinal Uses Tab */}
              {activeTab === 'medicinal' && (
                <>
                  {displayResult.medicinalUses?.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Medicinal Uses
                      </h3>
                      <div className="space-y-3">
                        {displayResult.medicinalUses.map((use, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                            </div>
                            <span className="text-sm text-gray-700">{use}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {displayResult.preparationMethods?.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg>
                        Preparation Methods
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {displayResult.preparationMethods.map((method, i) => (
                          <div key={i} className="flex items-start gap-2.5 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                            <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-700 text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                            <span className="text-sm text-gray-700">{method}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Ayurvedic Properties Tab */}
              {activeTab === 'ayurvedic' && displayResult.ayurvedicProperties && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
                    Ayurvedic Properties
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: 'rasa', label: 'Rasa (Taste)', color: 'bg-amber-50 border-amber-100 text-amber-800' },
                      { key: 'guna', label: 'Guna (Quality)', color: 'bg-blue-50 border-blue-100 text-blue-800' },
                      { key: 'virya', label: 'Virya (Potency)', color: 'bg-red-50 border-red-100 text-red-800' },
                      { key: 'vipaka', label: 'Vipaka (Post-digestive)', color: 'bg-purple-50 border-purple-100 text-purple-800' },
                    ].map(({ key, label, color }) => displayResult.ayurvedicProperties[key] && (
                      <div key={key} className={`p-4 rounded-xl border ${color}`}>
                        <p className="text-[11px] font-bold tracking-widest uppercase opacity-60 mb-1">{label}</p>
                        <p className="text-sm font-semibold">{displayResult.ayurvedicProperties[key]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Safety Tab */}
              {activeTab === 'safety' && displayResult.warnings?.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                    Warnings & Precautions
                  </h3>
                  <div className="space-y-3">
                    {displayResult.warnings.map((warning, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                        <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                        <span className="text-sm text-amber-800">{warning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar - Quick Facts and Actions only (image moved to left) */}
            <div className="flex flex-col gap-5">
              {/* Quick Facts */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-4">Quick Facts</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center"><svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg></div>
                    <div><p className="text-[11px] text-gray-400 font-medium">Parts Used</p><p className="text-xs font-semibold text-gray-800">{displayResult.partsUsed?.length || 0}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center"><svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                    <div><p className="text-[11px] text-gray-400 font-medium">Medicinal Uses</p><p className="text-xs font-semibold text-gray-800">{displayResult.medicinalUses?.length || 0}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center"><svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg></div>
                    <div><p className="text-[11px] text-gray-400 font-medium">Warnings</p><p className="text-xs font-semibold text-gray-800">{displayResult.warnings?.length || 0}</p></div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3">
                <button onClick={handleSaveToHistory} disabled={saving || saved}
                  className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {saved ? (<><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>Saved!</>) : saving ? 'Saving...' : (<><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></svg>Save to History</>)}
                </button>
                <button onClick={() => navigate('/plant-scan')}
                  className="w-full px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg>
                  Scan Another Plant
                </button>
                <button onClick={() => navigate('/plant-description')}
                  className="w-full px-4 py-2.5 text-sm font-semibold text-emerald-700 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2 border border-emerald-100">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                  Browse More Plants
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PlantDescriptionDetail;
