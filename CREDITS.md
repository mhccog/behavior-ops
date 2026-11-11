# Credits

## 3D figure ("Show me in 3D")
- **The person** is "Male_Adult_02" from the **Microsoft Rocketbox Avatar Library**
  (<https://github.com/microsoft/Microsoft-Rocketbox>), © 2020 Microsoft, released under the **MIT licence**.
  The full licence text is in [`figure/model/LICENSE-Rocketbox.txt`](figure/model/LICENSE-Rocketbox.txt).
  We converted the original FBX to glTF (FBX2glTF), shrank the textures to 1024 px WebP, kept 47 of the face shape keys
  (the ARKit-style set the cues need) and compressed it with glTF-Transform and meshopt. The result is `figure/model/person.glb` (about 0.75 MB).
  The faces in the background ("other people" in group cues) are see-through copies of the same model.
- **Animation**: a small invisible skeleton in `figure/viewer.js` is posed from hand-written keyframes in `figure/cues3d.js`
  (our own summaries of the cues). `figure/person.js` copies that skeleton onto the Rocketbox bones and drives its face shape keys.
  The chair, door, phone, pen, cup, watch and wallet are simple shapes made in code for this site.
- **three.js** (r170) renders the scene. It is © three.js authors under the [MIT licence](https://github.com/mrdoob/three.js/blob/dev/LICENSE)
  and is loaded from the jsDelivr CDN only when a figure is opened. OrbitControls, GLTFLoader, SkeletonUtils and the meshopt decoder come from the same package.
- The 3D figure is not a real person. Real people appear only in the openly licensed photos listed below.

## Real-example photos
Each photo shows a person making a gesture. It is not a claim about what that person was thinking or feeling.
All photos are openly licensed. We resized them to at most 800 px wide and re-encoded them as WebP. Nothing else was changed.
The same details are stored in `photos/photos.js` and shown under each photo on the site.

**Arms crossed (relaxed fingers)**

- `photos/arms-crossed-relaxed-fingers-1.webp`: "2019 - Paddy Cosgrave CG2 9345 (49005679831).jpg" by Web Summit, [CC BY 2.0](https://creativecommons.org/licenses/by/2.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:2019_-_Paddy_Cosgrave_CG2_9345_(49005679831).jpg)
- `photos/arms-crossed-relaxed-fingers-2.webp`: "118 Photo Officielle - Ministre d'Etat - secretaire general de la presidence Abidjan Cocody - Riveira 3 24 01 2021.jpg" by Joes Dongui, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:118_Photo_Officielle_-_Ministre_d%27Etat_-_secretaire_general_de_la_presidence_Abidjan_Cocody_-_Riveira_3_24_01_2021.jpg)

**Hands behind head**

- `photos/hands-behind-head-1.webp`: "2022-08-15 European Championships 2022 – Men's Decathlon – 100 Metres by Sandro Halank–027.jpg" by Sandro Halank, Wikimedia Commons, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:2022-08-15_European_Championships_2022_%E2%80%93_Men%27s_Decathlon_%E2%80%93_100_Metres_by_Sandro_Halank%E2%80%93027.jpg)
- `photos/hands-behind-head-2.webp`: "Djamel Sedjati in the 800 meters at the 2026 Wanda Diamond League’s Weltklasse Zürich athletics competition 01.jpg" by Quejaytee, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Djamel_Sedjati_in_the_800_meters_at_the_2026_Wanda_Diamond_League%E2%80%99s_Weltklasse_Z%C3%BCrich_athletics_competition_01.jpg)

**Hands behind back**

- `photos/hands-behind-back-1.webp`: "Luca Rambaldi.jpg" by Vanbasten 23, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Luca_Rambaldi.jpg)
- `photos/hands-behind-back-2.webp`: "Moscow, Bolotnaya Square, saturday visitors, July 2025 10.jpg" by Retired electrician, [CC0](http://creativecommons.org/publicdomain/zero/1.0/deed.en), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Moscow,_Bolotnaya_Square,_saturday_visitors,_July_2025_10.jpg)

**Hand to chest**

- `photos/hand-to-chest-1.webp`: "20220813 ECM22 Rowing 7708.jpg" by Ailura, [CC BY-SA 3.0 AT](https://creativecommons.org/licenses/by-sa/3.0/at/deed.en), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:20220813_ECM22_Rowing_7708.jpg)
- `photos/hand-to-chest-2.webp`: "250412 FC 서울 vs 대전 (최철원) 2.jpg" by Explicit, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:250412_FC_%EC%84%9C%EC%9A%B8_vs_%EB%8C%80%EC%A0%84_(%EC%B5%9C%EC%B2%A0%EC%9B%90)_2.jpg)

**Head tilt**

- `photos/head-tilt-1.webp`: "Claire Cunningham Photo A.R.jpg" by Vicky Wilson on behalf of Claire Cunningham Projects, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Claire_Cunningham_Photo_A.R.jpg)
- `photos/head-tilt-2.webp`: "Eileen.jpg" by Johntorcasio, [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Eileen.jpg)

**Both shoulders shrug**

- `photos/both-shoulders-shrug-1.webp`: "Shrugs.jpg" by Peterlocicero, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Shrugs.jpg)
- `photos/both-shoulders-shrug-2.webp`: "WAU 2025 Congress - Casa Herrera 00082.jpg" by Jorge Rosendo Negroe Álvarez, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:WAU_2025_Congress_-_Casa_Herrera_00082.jpg)

**Hushing (mouth cover, cough, nose scratch)**

- `photos/hushing-mouth-cover-cough-nose-scratch-1.webp`: "Man with hand over mouth.jpg" by Craig Sunter from Manchester, UK, [CC BY 2.0](https://creativecommons.org/licenses/by/2.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Man_with_hand_over_mouth.jpg)
- `photos/hushing-mouth-cover-cough-nose-scratch-2.webp`: "Embarrassed Simon Law.jpg" by Aleece Germano, [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Embarrassed_Simon_Law.jpg)

**Throat touch**

- `photos/throat-touch-1.webp`: "250524 FC 서울 vs 수원 (Marko Dugandžić) 3.jpg" by Explicit, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:250524_FC_%EC%84%9C%EC%9A%B8_vs_%EC%88%98%EC%9B%90_(Marko_Dugand%C5%BEi%C4%87)_3.jpg)
- `photos/throat-touch-2.webp`: "Raven Rockette at AVN Adult Entertainment Expo 2016 (25664542935).jpg" by Baldwin Saintilus from USA, [CC BY 2.0](https://creativecommons.org/licenses/by/2.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Raven_Rockette_at_AVN_Adult_Entertainment_Expo_2016_(25664542935).jpg)

**Palms open**

- `photos/palms-open-1.webp`: "2018-06-27-Magazine-Excellenze10099 R 1liv.jpg" by Professor Stefano Zanasi, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:2018-06-27-Magazine-Excellenze10099_R_1liv.jpg)
- `photos/palms-open-2.webp`: "Mark Zuckerberg F8 2018 Keynote.jpg" by Anthony Quintano from Honolulu, HI, United States, [CC BY 2.0](https://creativecommons.org/licenses/by/2.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Mark_Zuckerberg_F8_2018_Keynote.jpg)

**Squint**

- `photos/squint-1.webp`: "Benscottlinkin1.jpg" by losertron, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Benscottlinkin1.jpg)

**Object in mouth**

- `photos/object-in-mouth-1.webp`: "Работа энтомолога.jpg" by Табалыкин Евгений Алексеевич, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:%D0%A0%D0%B0%D0%B1%D0%BE%D1%82%D0%B0_%D1%8D%D0%BD%D1%82%D0%BE%D0%BC%D0%BE%D0%BB%D0%BE%D0%B3%D0%B0.jpg)

**Contempt (one-sided smirk)**

- `photos/contempt-one-sided-smirk-1.webp`: "Retouch Smirk glasses vip 1.jpg" by DanieldeWeldon1, [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Retouch_Smirk_glasses_vip_1.jpg)

**Disgust**

- `photos/disgust-1.webp`: "Disgust expression cropped.jpg" by Unknown (Wikimedia Commons), [CC BY 2.0](https://creativecommons.org/licenses/by/2.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Disgust_expression_cropped.jpg)
- `photos/disgust-2.webp`: "Man with beard and knit red cap frowns and has disgusted facial expression.jpg" by Lies Thru a Lens , [CC BY 2.0](https://creativecommons.org/licenses/by/2.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Man_with_beard_and_knit_red_cap_frowns_and_has_disgusted_facial_expression.jpg)

**Eyebrow flash**

- `photos/eyebrow-flash-1.webp`: "Flip Wilson (raised eyebrows) (1975-05-10)(Gerald Ford Library).jpg" by David Hume Kennerly, Public domain, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Flip_Wilson_(raised_eyebrows)_(1975-05-10)(Gerald_Ford_Library).jpg)

**Pupils dilate**

- `photos/pupils-dilate-1.webp`: "Dilated pupils 2006 (cropped 2).jpg" by Nutschig at English Wikipedia, [CC BY-SA 3.0](http://creativecommons.org/licenses/by-sa/3.0/), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Dilated_pupils_2006_(cropped_2).jpg)
- `photos/pupils-dilate-2.webp`: "1513 Mydriasis.jpg" by OpenStax College, [CC BY 3.0](https://creativecommons.org/licenses/by/3.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:1513_Mydriasis.jpg)

**Pupils constrict**

- `photos/pupils-constrict-1.webp`: "Human Man" by [George Becker](https://stocksnap.io/author/31938), [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/), via [Stocksnap](https://stocksnap.io/photo/human-man-32WPJG65LX)

**Eyelid rub**

- `photos/eyelid-rub-1.webp`: "Photograph of Astronaut M. Scott Carpenter Rubbing his Eyes on the Day of Aurora 7 Launch - DPLA - 24e10a5fe3cfd79e18aeb4ccfa2e897b.jpg" by U.S. Senate Committee on Aeronautical and Space Sciences (via DPLA), Public domain, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Photograph_of_Astronaut_M._Scott_Carpenter_Rubbing_his_Eyes_on_the_Day_of_Aurora_7_Launch_-_DPLA_-_24e10a5fe3cfd79e18aeb4ccfa2e897b.jpg)
- `photos/eyelid-rub-2.webp`: "Boy crying LCCN2016828598.jpg" by National Photo Company Collection, Public domain, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Boy_crying_LCCN2016828598.jpg)

**Smile reaching the eyes**

- `photos/smile-reaching-the-eyes-1.webp`: "Michaela Modjeska Paetsch with a big smile 1990.jpg" by Swanstone, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Michaela_Modjeska_Paetsch_with_a_big_smile_1990.jpg)
- `photos/smile-reaching-the-eyes-2.webp`: "Fishmonger smiling, Maracaibo street market, Venezuela.jpg" by Wilfredor, [CC0](http://creativecommons.org/publicdomain/zero/1.0/deed.en), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Fishmonger_smiling,_Maracaibo_street_market,_Venezuela.jpg)

**Grooming (hair, lint, straighten up)**

- `photos/grooming-hair-lint-straighten-up-1.webp`: "SUIT (5915912323).jpg" by Jonathan Mueller, [CC BY 2.0](https://creativecommons.org/licenses/by/2.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:SUIT_(5915912323).jpg)
- `photos/grooming-hair-lint-straighten-up-2.webp`: "Man in a sweater adjusting tie (Unsplash).jpg" by freestocks.org freestocks, [CC0](http://creativecommons.org/publicdomain/zero/1.0/deed.en), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Man_in_a_sweater_adjusting_tie_(Unsplash).jpg)

**Leans toward you**

- `photos/leans-toward-you-1.webp`: "Doutor Saulo Nardy Nader.jpg" by Leo Olinda, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Doutor_Saulo_Nardy_Nader.jpg)

**Legs crossed toward you**

- `photos/legs-crossed-toward-you-1.webp`: "2005 WashingtonDC 44728072.jpg" by Elvert Barnes, [CC BY 2.0](https://creativecommons.org/licenses/by/2.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:2005_WashingtonDC_44728072.jpg)
- `photos/legs-crossed-toward-you-2.webp`: "15092-Ambassador Jordan-Middle East Forum-7618 (16963215956).jpg" by Texas A&M University-Commerce Marketing Communications Photography, [CC BY 2.0](https://creativecommons.org/licenses/by/2.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:15092-Ambassador_Jordan-Middle_East_Forum-7618_(16963215956).jpg)

**Locked ankles / legs bound tight**

- `photos/locked-ankles-legs-bound-tight-1.webp`: "180403 크록스 라이트라이드 런칭행사 윤아 01.jpg" by Like a Fool, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:180403_%ED%81%AC%EB%A1%9D%EC%8A%A4_%EB%9D%BC%EC%9D%B4%ED%8A%B8%EB%9D%BC%EC%9D%B4%EB%93%9C_%EB%9F%B0%EC%B9%AD%ED%96%89%EC%82%AC_%EC%9C%A4%EC%95%84_01.jpg)

**Hands clasp knees**

- `photos/hands-clasp-knees-1.webp`: "Emily Barclay (6986354859).jpg" by Eva Rinaldi, [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Emily_Barclay_(6986354859).jpg)

**Toes point inward**

- `photos/toes-point-inward-1.webp`: "タイツ (2879129180).jpg" by nakimusi, [CC BY 2.0](https://creativecommons.org/licenses/by/2.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:%E3%82%BF%E3%82%A4%E3%83%84_(2879129180).jpg)

**Watch check**

- `photos/watch-check-1.webp`: "Nephthaly.jpg" by Nephius Mugalu, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Nephthaly.jpg)
- `photos/watch-check-2.webp`: "Man checking watch inside a modern building during a busy day.jpg" by Shixart1985, [CC BY 2.0](https://creativecommons.org/licenses/by/2.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Man_checking_watch_inside_a_modern_building_during_a_busy_day.jpg)

**Glance to a third person**

- `photos/glance-to-a-third-person-1.webp`: "1965 Regard amusé.jpg" by Selmoval, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:1965_Regard_amus%C3%A9.jpg)

**Arm or object as a barrier**

- `photos/arm-or-object-as-a-barrier-1.webp`: "Free woman holding cup coffee" by rawpixel, [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/), via [Rawpixel](https://www.rawpixel.com/image/5924470/photo-image-public-domain-woman-free)

**Jewellery or cuff play**

- `photos/jewellery-or-cuff-play-1.webp`: "Man adjusts cufflinks while sitting at a bar in a restaurant.jpg" by Shixart1985, [CC BY 2.0](https://creativecommons.org/licenses/by/2.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Man_adjusts_cufflinks_while_sitting_at_a_bar_in_a_restaurant.jpg)
- `photos/jewellery-or-cuff-play-2.webp`: "Man dressed in formal suit sitting at bar preparing for event in a modern venue.jpg" by Shixart1985, [CC BY 2.0](https://creativecommons.org/licenses/by/2.0), via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Man_dressed_in_formal_suit_sitting_at_bar_preparing_for_event_in_a_modern_venue.jpg)

## Content
All frameworks belong to Chase Hughes, *The Behavior Ops Manual* (2023). This site paraphrases them with page references and reproduces no book text.

## Ask tab sources
All Ask entries summarise Chase Hughes' own work in our own words: *The Behavior Ops Manual* (page refs), [NCI University](https://nci.university/), [The Behavior Panel](https://www.thebehaviorpanel.com/), his YouTube channel [@chasehughesofficial](https://www.youtube.com/@chasehughesofficial), and his *Diary of a CEO* appearances ([2024](https://www.youtube.com/watch?v=RvjR9GM2kX8), [2026](https://www.youtube.com/watch?v=9uSXOr-AdAU)). Every entry links its source.
