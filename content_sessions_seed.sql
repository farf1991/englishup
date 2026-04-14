-- ============================================================
-- ENGLISHUP — CONTENU DES 60 SESSIONS
-- Colle dans Supabase > SQL Editor > Run
-- Sessions 1-60 × 3 niveaux × 3 groupes d'âge
-- ============================================================

-- ════════════════════════════════════════════════════════════
-- NIVEAU: STARTER | GROUPE: EXPLORER (6–9 ans)
-- ════════════════════════════════════════════════════════════

INSERT INTO content_sessions (session_number, level, age_group, title, vocab, grammar, listening, review_questions) VALUES

(1, 'starter', 'explorer', 'Colors & Animals',
'[
  {"word":"Red","translation":"Rouge","example":"The apple is red.","emoji":"🔴"},
  {"word":"Blue","translation":"Bleu","example":"The sky is blue.","emoji":"🔵"},
  {"word":"Dog","translation":"Chien","example":"The dog is happy.","emoji":"🐕"},
  {"word":"Cat","translation":"Chat","example":"I have a cat.","emoji":"🐱"}
]'::jsonb,
'{"rule":"To be — am / is / are","explanation":"On utilise ''am'' avec I, ''is'' avec he/she/it, et ''are'' avec you/we/they.","examples":["I am happy.","She is a cat.","They are dogs."],"questions":[{"id":"g1","q":"I ___ a student.","choices":["am","is","are","be"],"correct":0,"explanation":"Avec I, on utilise toujours AM."},{"id":"g2","q":"The dog ___ big.","choices":["am","is","are","be"],"correct":1,"explanation":"Avec the dog (he/she/it), on utilise IS."},{"id":"g3","q":"We ___ friends.","choices":["am","is","are","be"],"correct":2,"explanation":"Avec we, on utilise ARE."}]}'::jsonb,
'{"transcript":"Hello! My name is Lily. I am seven years old. I have a dog. His name is Max. Max is brown. I love my dog!","questions":[{"id":"l1","q":"What is the girl''s name?","choices":["Lucy","Lily","Lena","Lisa"],"correct":1,"explanation":"She says ''My name is Lily''."},{"id":"l2","q":"How old is Lily?","choices":["6","7","8","9"],"correct":1,"explanation":"She says ''I am seven years old''."},{"id":"l3","q":"What color is Max?","choices":["Black","White","Brown","Red"],"correct":2,"explanation":"She says ''Max is brown''."}]}'::jsonb,
'[{"id":"r1","q":"What color is the sky?","choices":["Red","Blue","Green","Yellow"],"correct":1,"explanation":"The sky is blue — Le ciel est bleu."},{"id":"r2","q":"I ___ happy today.","choices":["is","are","am","be"],"correct":2,"explanation":"Avec I, on utilise AM."},{"id":"r3","q":"The cat ___ small.","choices":["am","are","is","be"],"correct":2,"explanation":"Avec the cat (it), on utilise IS."}]'::jsonb),

(2, 'starter', 'explorer', 'Numbers & Family',
'[
  {"word":"One","translation":"Un","example":"I have one cat.","emoji":"1️⃣"},
  {"word":"Two","translation":"Deux","example":"Two dogs are playing.","emoji":"2️⃣"},
  {"word":"Mother","translation":"Maman","example":"My mother is kind.","emoji":"👩"},
  {"word":"Father","translation":"Papa","example":"My father is tall.","emoji":"👨"}
]'::jsonb,
'{"rule":"My / Your / His / Her","explanation":"My = mon/ma, Your = ton/ta, His = son (garçon), Her = sa (fille).","examples":["My name is Tom.","Her cat is white.","His dog is big."],"questions":[{"id":"g1","q":"___ name is Emma. (Emma parle)","choices":["My","Your","His","Her"],"correct":0,"explanation":"Emma parle d''elle-même → MY."},{"id":"g2","q":"Tom has a dog. ___ dog is brown.","choices":["My","Your","His","Her"],"correct":2,"explanation":"Tom est un garçon → HIS."},{"id":"g3","q":"Sara has a cat. ___ cat is white.","choices":["My","Your","His","Her"],"correct":3,"explanation":"Sara est une fille → HER."}]}'::jsonb,
'{"transcript":"Hi! I am Tom. I am eight years old. I have a big family. My mother is nice. My father is funny. I have one sister. Her name is Anna. We are happy!","questions":[{"id":"l1","q":"How old is Tom?","choices":["7","8","9","10"],"correct":1,"explanation":"Tom says ''I am eight years old''."},{"id":"l2","q":"What is his sister''s name?","choices":["Emma","Anna","Lisa","Sara"],"correct":1,"explanation":"He says ''Her name is Anna''."},{"id":"l3","q":"How many sisters does Tom have?","choices":["0","1","2","3"],"correct":1,"explanation":"He says ''I have one sister''."}]}'::jsonb,
'[{"id":"r1","q":"My ___ is kind. (mère)","choices":["father","brother","mother","sister"],"correct":2,"explanation":"Mother = maman."},{"id":"r2","q":"___ dog is big. (son chien, pour un garçon)","choices":["My","Her","His","Your"],"correct":2,"explanation":"Pour un garçon, on utilise HIS."},{"id":"r3","q":"Two + Two = ?","choices":["Three","Four","Five","Six"],"correct":1,"explanation":"2 + 2 = Four (quatre)."}]'::jsonb),

(3, 'starter', 'explorer', 'Food & I Like',
'[
  {"word":"Apple","translation":"Pomme","example":"I like apples.","emoji":"🍎"},
  {"word":"Bread","translation":"Pain","example":"I eat bread for breakfast.","emoji":"🍞"},
  {"word":"Milk","translation":"Lait","example":"I drink milk every day.","emoji":"🥛"},
  {"word":"Pizza","translation":"Pizza","example":"Pizza is delicious!","emoji":"🍕"}
]'::jsonb,
'{"rule":"I like / I don''t like","explanation":"Pour dire ce qu''on aime : I like + nom. Pour dire ce qu''on n''aime pas : I don''t like + nom.","examples":["I like pizza.","I don''t like milk.","Do you like apples?"],"questions":[{"id":"g1","q":"I ___ cats. (j''aime)","choices":["like","likes","don''t like","am like"],"correct":0,"explanation":"I like = j''aime. Simple et direct !"},{"id":"g2","q":"I ___ vegetables. (je n''aime pas)","choices":["like","don''t like","likes","am not like"],"correct":1,"explanation":"I don''t like = je n''aime pas."},{"id":"g3","q":"___ you like pizza?","choices":["Do","Does","Is","Are"],"correct":0,"explanation":"Pour les questions avec I/you/we/they, on utilise DO."}]}'::jsonb,
'{"transcript":"Hello! My name is Mia. I like food! My favourite food is pizza. I also like apples and bread. I don''t like milk. It is not good! Do you like pizza too?","questions":[{"id":"l1","q":"What is Mia''s favourite food?","choices":["Apple","Bread","Milk","Pizza"],"correct":3,"explanation":"She says ''My favourite food is pizza''."},{"id":"l2","q":"Does Mia like milk?","choices":["Yes","No","Maybe","Sometimes"],"correct":1,"explanation":"She says ''I don''t like milk''."},{"id":"l3","q":"What does Mia also like?","choices":["Vegetables","Apples","Fish","Juice"],"correct":1,"explanation":"She says ''I also like apples and bread''."}]}'::jsonb,
'[{"id":"r1","q":"I ___ pizza. (j''aime)","choices":["likes","like","am like","don''t"],"correct":1,"explanation":"I like = j''aime."},{"id":"r2","q":"I don''t like ___. (lait)","choices":["bread","pizza","milk","apple"],"correct":2,"explanation":"Milk = lait."},{"id":"r3","q":"___ you like cats?","choices":["Is","Does","Do","Are"],"correct":2,"explanation":"Avec you, on utilise DO pour les questions."}]'::jsonb),

(4, 'starter', 'explorer', 'Body Parts & Feelings',
'[
  {"word":"Head","translation":"Tête","example":"My head is big!","emoji":"🗣️"},
  {"word":"Hands","translation":"Mains","example":"I have two hands.","emoji":"👐"},
  {"word":"Happy","translation":"Heureux/se","example":"I am happy today!","emoji":"😊"},
  {"word":"Tired","translation":"Fatigué(e)","example":"I am tired after school.","emoji":"😴"}
]'::jsonb,
'{"rule":"I have / I am","explanation":"I have = j''ai (pour les choses). I am = je suis (pour les états et qualités).","examples":["I have two eyes.","I am happy.","She has brown hair.","He is tired."],"questions":[{"id":"g1","q":"I ___ two hands.","choices":["am","is","have","has"],"correct":2,"explanation":"Pour posséder quelque chose, on utilise HAVE avec I."},{"id":"g2","q":"She ___ happy today.","choices":["have","has","am","is"],"correct":3,"explanation":"Avec she, on utilise IS pour les états."},{"id":"g3","q":"They ___ big eyes.","choices":["is","am","have","has"],"correct":2,"explanation":"Avec they (pluriel), on utilise HAVE."}]}'::jsonb,
'{"transcript":"My name is Ben. I have a big head! I have two eyes, one nose and one mouth. I have ten fingers. Today I am happy because it is my birthday! I am not tired. I am excited!","questions":[{"id":"l1","q":"How many fingers does Ben have?","choices":["8","9","10","11"],"correct":2,"explanation":"He says ''I have ten fingers''."},{"id":"l2","q":"How does Ben feel today?","choices":["Sad","Tired","Happy","Angry"],"correct":2,"explanation":"He says ''I am happy''."},{"id":"l3","q":"Why is Ben happy?","choices":["New toy","Birthday","Holiday","Dog"],"correct":1,"explanation":"He says ''it is my birthday''."}]}'::jsonb,
'[{"id":"r1","q":"I ___ happy. (état)","choices":["have","has","am","are"],"correct":2,"explanation":"Pour les états : I am."},{"id":"r2","q":"She ___ blue eyes. (possession)","choices":["am","is","have","has"],"correct":3,"explanation":"She has = elle a."},{"id":"r3","q":"''Tired'' means...","choices":["Happy","Angry","Sleepy/Tired","Excited"],"correct":2,"explanation":"Tired = fatigué(e)."}]'::jsonb),

(5, 'starter', 'explorer', 'School & Objects',
'[
  {"word":"Pencil","translation":"Crayon","example":"I write with a pencil.","emoji":"✏️"},
  {"word":"Book","translation":"Livre","example":"I read a book.","emoji":"📚"},
  {"word":"Teacher","translation":"Professeur","example":"My teacher is nice.","emoji":"👩‍🏫"},
  {"word":"School","translation":"École","example":"I go to school every day.","emoji":"🏫"}
]'::jsonb,
'{"rule":"A / An — l''article indéfini","explanation":"On utilise ''a'' avant une consonne (a dog, a cat, a pencil). On utilise ''an'' avant une voyelle (an apple, an egg, an orange).","examples":["I have a pencil.","She has an apple.","He is a teacher.","It is an elephant."],"questions":[{"id":"g1","q":"I have ___ orange.","choices":["a","an","the","some"],"correct":1,"explanation":"Orange commence par une voyelle → AN orange."},{"id":"g2","q":"She is ___ teacher.","choices":["an","the","a","some"],"correct":2,"explanation":"Teacher commence par une consonne → A teacher."},{"id":"g3","q":"I read ___ book.","choices":["an","some","a","the"],"correct":2,"explanation":"Book commence par une consonne → A book."}]}'::jsonb,
'{"transcript":"Good morning! I am at school. I have a bag. In my bag, I have books and pencils. My teacher is Miss Smith. She is very nice. I like school because I learn new things every day!","questions":[{"id":"l1","q":"What does the child have in the bag?","choices":["Food","Books and pencils","Toys","Clothes"],"correct":1,"explanation":"''I have books and pencils''."},{"id":"l2","q":"What is the teacher''s name?","choices":["Miss Brown","Miss Jones","Miss Smith","Miss White"],"correct":2,"explanation":"She says ''My teacher is Miss Smith''."},{"id":"l3","q":"Why does the child like school?","choices":["Friends","Food","Learn new things","Play"],"correct":2,"explanation":"''I learn new things every day''."}]}'::jsonb,
'[{"id":"r1","q":"___ elephant is big. (a ou an ?)","choices":["A","An","The","Some"],"correct":1,"explanation":"Elephant commence par une voyelle → AN."},{"id":"r2","q":"''Pencil'' means...","choices":["Pen","Eraser","Pencil/Crayon","Ruler"],"correct":2,"explanation":"Pencil = crayon."},{"id":"r3","q":"I go to ___ every day.","choices":["home","school","park","shop"],"correct":1,"explanation":"School = école."}]'::jsonb);

-- Sessions 6-10 Starter Explorer
INSERT INTO content_sessions (session_number, level, age_group, title, vocab, grammar, listening, review_questions) VALUES

(6, 'starter', 'explorer', 'Days & Weather',
'[
  {"word":"Monday","translation":"Lundi","example":"School starts on Monday.","emoji":"📅"},
  {"word":"Sunny","translation":"Ensoleillé","example":"It is sunny today!","emoji":"☀️"},
  {"word":"Rain","translation":"Pluie","example":"I don''t like rain.","emoji":"🌧️"},
  {"word":"Weekend","translation":"Week-end","example":"I play on the weekend.","emoji":"🎉"}
]'::jsonb,
'{"rule":"It is + adjectif météo","explanation":"Pour parler de la météo en anglais : It is sunny / rainy / cold / hot / windy.","examples":["It is sunny today.","It is cold in winter.","Is it rainy?","It is not hot."],"questions":[{"id":"g1","q":"___ is cold today.","choices":["He","She","It","They"],"correct":2,"explanation":"Pour la météo, on utilise toujours IT."},{"id":"g2","q":"It is ___ today. (ensoleillé)","choices":["rain","sunny","sun","raining"],"correct":1,"explanation":"Sunny = ensoleillé (adjectif)."},{"id":"g3","q":"It is not ___. (froid)","choices":["cold","sun","rain","windy"],"correct":0,"explanation":"Cold = froid."}]}'::jsonb,
'{"transcript":"Today is Monday. It is sunny and warm! I am happy. On Tuesday, it is rainy. I don''t like rain. Wednesday is my favourite day because we have art class. The weekend is Saturday and Sunday. I love the weekend!","questions":[{"id":"l1","q":"What is the weather on Monday?","choices":["Rainy","Windy","Sunny","Cold"],"correct":2,"explanation":"''Today is Monday. It is sunny''."},{"id":"l2","q":"What is the child''s favourite day?","choices":["Monday","Tuesday","Wednesday","Friday"],"correct":2,"explanation":"''Wednesday is my favourite day''."},{"id":"l3","q":"When is the weekend?","choices":["Mon-Tue","Thu-Fri","Sat-Sun","Fri-Sat"],"correct":2,"explanation":"Saturday and Sunday = le week-end."}]}'::jsonb,
'[{"id":"r1","q":"___ is sunny today.","choices":["He","She","It","They"],"correct":2,"explanation":"Météo → IT."},{"id":"r2","q":"''Monday'' = ?","choices":["Mardi","Lundi","Mercredi","Jeudi"],"correct":1,"explanation":"Monday = Lundi."},{"id":"r3","q":"I love the ___. (week-end)","choices":["week","weekend","weekday","holiday"],"correct":1,"explanation":"Weekend = week-end."}]'::jsonb),

(7, 'starter', 'explorer', 'Animals & Can',
'[
  {"word":"Jump","translation":"Sauter","example":"Rabbits can jump high.","emoji":"🐇"},
  {"word":"Swim","translation":"Nager","example":"Fish can swim fast.","emoji":"🐠"},
  {"word":"Fly","translation":"Voler","example":"Birds can fly.","emoji":"🐦"},
  {"word":"Run","translation":"Courir","example":"Dogs can run fast.","emoji":"🐕"}
]'::jsonb,
'{"rule":"Can / Can''t","explanation":"CAN exprime une capacité ou une possibilité. CAN''T (cannot) = ne peut pas.","examples":["Birds can fly.","Fish can''t walk.","Can you swim?","I can jump!"],"questions":[{"id":"g1","q":"Fish ___ swim.","choices":["can","can''t","is","are"],"correct":0,"explanation":"Les poissons PEUVENT nager → CAN."},{"id":"g2","q":"Dogs ___ fly.","choices":["can","can''t","is","does"],"correct":1,"explanation":"Les chiens NE PEUVENT PAS voler → CAN''T."},{"id":"g3","q":"___ you jump?","choices":["Do","Are","Can","Is"],"correct":2,"explanation":"Pour demander une capacité → CAN you...?"}]}'::jsonb,
'{"transcript":"Hello! I am Zoe and I love animals. Dogs can run and jump. Birds can fly but they can''t swim. Fish can swim but they can''t walk. Cats can jump very high! What animal do you like?","questions":[{"id":"l1","q":"What can birds do?","choices":["Swim","Walk","Fly","Run"],"correct":2,"explanation":"''Birds can fly''."},{"id":"l2","q":"What can''t fish do?","choices":["Swim","Eat","Jump","Walk"],"correct":3,"explanation":"''Fish can''t walk''."},{"id":"l3","q":"What can cats do very well?","choices":["Fly","Swim","Jump high","Run slow"],"correct":2,"explanation":"''Cats can jump very high''."}]}'::jsonb,
'[{"id":"r1","q":"Birds ___ fly.","choices":["can''t","cannot","can","don''t"],"correct":2,"explanation":"Les oiseaux peuvent voler → CAN."},{"id":"r2","q":"''Swim'' means...","choices":["Courir","Sauter","Nager","Voler"],"correct":2,"explanation":"Swim = nager."},{"id":"r3","q":"I ___ run fast. (je ne peux pas)","choices":["can","can''t","am","is"],"correct":1,"explanation":"I can''t = je ne peux pas."}]'::jsonb),

(8, 'starter', 'explorer', 'House & Rooms',
'[
  {"word":"Kitchen","translation":"Cuisine","example":"We cook in the kitchen.","emoji":"🍳"},
  {"word":"Bedroom","translation":"Chambre","example":"I sleep in my bedroom.","emoji":"🛏️"},
  {"word":"Garden","translation":"Jardin","example":"We play in the garden.","emoji":"🌳"},
  {"word":"Big","translation":"Grand(e)","example":"My house is big.","emoji":"🏠"}
]'::jsonb,
'{"rule":"There is / There are","explanation":"There is = il y a (singulier). There are = il y a (pluriel). Pour la négation : There isn''t / There aren''t.","examples":["There is a bed in my room.","There are three chairs.","There isn''t a garden."],"questions":[{"id":"g1","q":"___ a cat in the garden.","choices":["There are","There is","It is","They are"],"correct":1,"explanation":"Un seul chat → THERE IS."},{"id":"g2","q":"___ five rooms in my house.","choices":["There is","There are","It is","They are"],"correct":1,"explanation":"5 rooms = pluriel → THERE ARE."},{"id":"g3","q":"___ a kitchen in the house.","choices":["Is there","Are there","There is","There are"],"correct":0,"explanation":"Question au singulier → IS THERE?"}]}'::jsonb,
'{"transcript":"Hello! This is my house. There is a big kitchen. I love cooking! There are three bedrooms. My bedroom is small but cosy. There is a garden too. We play football in the garden. Is there a pool? No, there isn''t!","questions":[{"id":"l1","q":"How many bedrooms are there?","choices":["1","2","3","4"],"correct":2,"explanation":"''There are three bedrooms''."},{"id":"l2","q":"What do they do in the garden?","choices":["Cook","Sleep","Play football","Read"],"correct":2,"explanation":"''We play football in the garden''."},{"id":"l3","q":"Is there a pool?","choices":["Yes","No","Maybe","Sometimes"],"correct":1,"explanation":"''No, there isn''t!''"}]}'::jsonb,
'[{"id":"r1","q":"___ a dog in the garden.","choices":["There are","There is","It are","They is"],"correct":1,"explanation":"Un seul chien → THERE IS."},{"id":"r2","q":"''Kitchen'' means...","choices":["Chambre","Salon","Cuisine","Jardin"],"correct":2,"explanation":"Kitchen = cuisine."},{"id":"r3","q":"___ two cats in the house.","choices":["There is","There are","It is","Is there"],"correct":1,"explanation":"Deux chats = pluriel → THERE ARE."}]'::jsonb),

(9, 'starter', 'explorer', 'Clothes & Seasons',
'[
  {"word":"T-shirt","translation":"T-shirt","example":"I wear a t-shirt in summer.","emoji":"👕"},
  {"word":"Coat","translation":"Manteau","example":"I wear a coat in winter.","emoji":"🧥"},
  {"word":"Summer","translation":"Été","example":"Summer is hot.","emoji":"☀️"},
  {"word":"Winter","translation":"Hiver","example":"Winter is cold.","emoji":"❄️"}
]'::jsonb,
'{"rule":"I wear / I don''t wear — Present Simple","explanation":"Wear = porter (des vêtements). On utilise le présent simple pour les habitudes.","examples":["I wear a coat in winter.","She wears a dress.","I don''t wear a hat.","Do you wear glasses?"],"questions":[{"id":"g1","q":"She ___ a dress to school.","choices":["wear","wears","wearing","wore"],"correct":1,"explanation":"Avec she, on ajoute -s au verbe : wears."},{"id":"g2","q":"I ___ a coat in summer.","choices":["wear","don''t wear","wears","wearing"],"correct":1,"explanation":"En été, on ne porte pas de manteau → I don''t wear."},{"id":"g3","q":"___ you wear a hat?","choices":["Does","Is","Do","Are"],"correct":2,"explanation":"Question avec you → DO you...?"}]}'::jsonb,
'{"transcript":"Hello! My name is Leo. I love clothes! In summer, I wear a t-shirt and shorts. It is hot! In winter, I wear a coat and boots. It is very cold! In spring, I wear a jacket. What do you wear in autumn?","questions":[{"id":"l1","q":"What does Leo wear in summer?","choices":["Coat and boots","T-shirt and shorts","Jacket","Hat"],"correct":1,"explanation":"''In summer, I wear a t-shirt and shorts''."},{"id":"l2","q":"What is the weather in winter?","choices":["Hot","Sunny","Very cold","Windy"],"correct":2,"explanation":"''It is very cold!''."},{"id":"l3","q":"What does Leo wear in spring?","choices":["T-shirt","Coat","Jacket","Boots"],"correct":2,"explanation":"''In spring, I wear a jacket''."}]}'::jsonb,
'[{"id":"r1","q":"I ___ a coat in winter. (je porte)","choices":["wearing","wears","wear","wore"],"correct":2,"explanation":"I wear = je porte."},{"id":"r2","q":"''Summer'' means...","choices":["Hiver","Printemps","Automne","Été"],"correct":3,"explanation":"Summer = été."},{"id":"r3","q":"She ___ a hat. (porte)","choices":["wear","wore","wears","wearing"],"correct":2,"explanation":"Avec she → wears (avec -s)."}]'::jsonb),

(10, 'starter', 'explorer', 'Daily Routine',
'[
  {"word":"Wake up","translation":"Se réveiller","example":"I wake up at 7.","emoji":"⏰"},
  {"word":"Breakfast","translation":"Petit-déjeuner","example":"I eat breakfast at 8.","emoji":"🥣"},
  {"word":"Bedtime","translation":"Heure de dormir","example":"My bedtime is 9 o''clock.","emoji":"🌙"},
  {"word":"Always","translation":"Toujours","example":"I always brush my teeth.","emoji":"🪥"}
]'::jsonb,
'{"rule":"Adverbes de fréquence","explanation":"Always (toujours) > Usually (d''habitude) > Often (souvent) > Sometimes (parfois) > Never (jamais). Ils se placent AVANT le verbe principal.","examples":["I always wake up early.","She sometimes eats pizza.","He never drinks soda."],"questions":[{"id":"g1","q":"I ___ brush my teeth. (toujours)","choices":["never","sometimes","always","often"],"correct":2,"explanation":"Always = toujours."},{"id":"g2","q":"She ___ eats vegetables. (jamais)","choices":["always","often","sometimes","never"],"correct":3,"explanation":"Never = jamais."},{"id":"g3","q":"I always ___ up at 7.","choices":["wakes","woke","wake","waking"],"correct":2,"explanation":"Avec I, pas de -s : wake up."}]}'::jsonb,
'{"transcript":"Hi! My name is Emma. Every day, I wake up at seven o''clock. I always eat breakfast. I usually have cereal and milk. I sometimes have toast. I go to school at eight. After school, I often play outside. I never watch TV before homework. My bedtime is nine o''clock.","questions":[{"id":"l1","q":"What time does Emma wake up?","choices":["6 o''clock","7 o''clock","8 o''clock","9 o''clock"],"correct":1,"explanation":"''I wake up at seven o''clock''."},{"id":"l2","q":"What does Emma NEVER do before homework?","choices":["Eat","Play","Watch TV","Read"],"correct":2,"explanation":"''I never watch TV before homework''."},{"id":"l3","q":"What time is Emma''s bedtime?","choices":["8","9","10","11"],"correct":1,"explanation":"''My bedtime is nine o''clock''."}]}'::jsonb,
'[{"id":"r1","q":"I ___ eat breakfast. (toujours)","choices":["never","sometimes","always","often"],"correct":2,"explanation":"Always = toujours."},{"id":"r2","q":"''Wake up'' means...","choices":["Dormir","Manger","Se réveiller","Jouer"],"correct":2,"explanation":"Wake up = se réveiller."},{"id":"r3","q":"She ___ watches TV. (jamais)","choices":["always","never","often","sometimes"],"correct":1,"explanation":"Never = jamais."}]'::jsonb);

-- ════════════════════════════════════════════════════════════
-- NIVEAU: EXPLORER (A2) | GROUPE: ADVENTURER (10–13 ans)
-- Sessions 1-10
-- ════════════════════════════════════════════════════════════

INSERT INTO content_sessions (session_number, level, age_group, title, vocab, grammar, listening, review_questions) VALUES

(1, 'explorer', 'adventurer', 'Present Simple vs Continuous',
'[
  {"word":"Determined","translation":"Déterminé(e)","example":"She was determined to win.","emoji":"💪"},
  {"word":"Curious","translation":"Curieux/se","example":"He is curious about science.","emoji":"🔍"},
  {"word":"Achieve","translation":"Accomplir/Réaliser","example":"You can achieve anything.","emoji":"🎯"},
  {"word":"Challenge","translation":"Défi","example":"This is a big challenge.","emoji":"⚡"}
]'::jsonb,
'{"rule":"Present Simple vs Present Continuous","explanation":"Present Simple = habitudes/vérités (She plays tennis every day). Present Continuous = action en cours (She is playing tennis now).","examples":["I usually walk to school. / I am walking to school right now.","He reads every night. / He is reading a book at the moment."],"questions":[{"id":"g1","q":"She ___ (play) tennis every day.","choices":["plays","is playing","play","playing"],"correct":0,"explanation":"''Every day'' indique une habitude → Present Simple : plays."},{"id":"g2","q":"Look! They ___ (run) in the park.","choices":["run","runs","are running","is running"],"correct":2,"explanation":"''Look!'' indique une action en cours → Present Continuous : are running."},{"id":"g3","q":"I ___ (not/like) vegetables. I never eat them.","choices":["am not liking","don''t like","isn''t liking","doesn''t like"],"correct":1,"explanation":"Habitude/goût → Present Simple : don''t like."}]}'::jsonb,
'{"transcript":"Hi, I''m Jake! I usually go to school by bus, but today I''m walking because it''s sunny. My sister always reads at night, but right now she''s watching TV. My parents are cooking dinner at the moment. We normally eat at 7pm. I love my family''s routines!","questions":[{"id":"l1","q":"How does Jake usually go to school?","choices":["By car","By bus","Walking","By bike"],"correct":1,"explanation":"''I usually go to school by bus''."},{"id":"l2","q":"What is his sister doing RIGHT NOW?","choices":["Reading","Watching TV","Cooking","Sleeping"],"correct":1,"explanation":"''Right now she''s watching TV''."},{"id":"l3","q":"What time do they normally eat?","choices":["6pm","7pm","8pm","9pm"],"correct":1,"explanation":"''We normally eat at 7pm''."}]}'::jsonb,
'[{"id":"r1","q":"She ___ (study) right now. (action en cours)","choices":["studies","study","is studying","are studying"],"correct":2,"explanation":"Action en cours → IS studying (Present Continuous)."},{"id":"r2","q":"They always ___ football on Sundays.","choices":["playing","are playing","plays","play"],"correct":3,"explanation":"Always + habitude → Present Simple : play."},{"id":"r3","q":"''Achieve'' means...","choices":["Échouer","Accomplir","Essayer","Vouloir"],"correct":1,"explanation":"Achieve = accomplir, réaliser."}]'::jsonb),

(2, 'explorer', 'adventurer', 'Past Simple — Regular & Irregular',
'[
  {"word":"Successful","translation":"Réussi(e)/Qui réussit","example":"She had a successful career.","emoji":"🏆"},
  {"word":"Discover","translation":"Découvrir","example":"He discovered a new planet.","emoji":"🌍"},
  {"word":"Adventure","translation":"Aventure","example":"Life is a great adventure.","emoji":"🗺️"},
  {"word":"Memorable","translation":"Mémorable","example":"It was a memorable day.","emoji":"⭐"}
]'::jsonb,
'{"rule":"Past Simple — réguliers et irréguliers","explanation":"Verbes réguliers : +ed (play → played, walk → walked). Irréguliers à mémoriser : go → went, see → saw, eat → ate, have → had, run → ran.","examples":["I played football yesterday.","She went to Paris last week.","We saw a film on Saturday."],"questions":[{"id":"g1","q":"Yesterday, I ___ (go) to the cinema.","choices":["go","goes","went","goed"],"correct":2,"explanation":"Go est irrégulier → WENT au passé."},{"id":"g2","q":"She ___ (play) tennis last Sunday.","choices":["play","plays","played","plaied"],"correct":2,"explanation":"Play est régulier → PLAYED (+ed)."},{"id":"g3","q":"They ___ (not/see) the film.","choices":["didn''t see","didn''t saw","don''t see","not saw"],"correct":0,"explanation":"Négatif au passé : didn''t + base verbale (didn''t see, PAS saw)."}]}'::jsonb,
'{"transcript":"Last summer, I went on an amazing adventure! My family and I travelled to Morocco. We saw beautiful mountains and ate delicious food. I discovered a new sport: sandboarding! It was incredible. I also learned three words in Arabic. The trip was very memorable. I took many photos and I still look at them!","questions":[{"id":"l1","q":"Where did the family go last summer?","choices":["Spain","Morocco","France","Egypt"],"correct":1,"explanation":"''We travelled to Morocco''."},{"id":"l2","q":"What new sport did the narrator discover?","choices":["Surfing","Skiing","Sandboarding","Hiking"],"correct":2,"explanation":"''I discovered a new sport: sandboarding''."},{"id":"l3","q":"How many Arabic words did they learn?","choices":["1","2","3","4"],"correct":2,"explanation":"''I learned three words in Arabic''."}]}'::jsonb,
'[{"id":"r1","q":"We ___ (eat) at a great restaurant. (passé)","choices":["eated","eat","ate","eaten"],"correct":2,"explanation":"Eat est irrégulier → ATE au passé."},{"id":"r2","q":"She didn''t ___ (come) to school.","choices":["came","coming","comes","come"],"correct":3,"explanation":"Après didn''t, on utilise la BASE verbale : come."},{"id":"r3","q":"''Memorable'' means...","choices":["Ennuyeux","Oublié","Mémorable","Difficile"],"correct":2,"explanation":"Memorable = mémorable, dont on se souvient."}]'::jsonb),

(3, 'explorer', 'adventurer', 'Future — Will & Going To',
'[
  {"word":"Ambitious","translation":"Ambitieux/se","example":"She is very ambitious.","emoji":"🚀"},
  {"word":"Probably","translation":"Probablement","example":"It will probably rain.","emoji":"🌧️"},
  {"word":"Career","translation":"Carrière","example":"I want a great career.","emoji":"💼"},
  {"word":"Predict","translation":"Prédire","example":"Can you predict the future?","emoji":"🔮"}
]'::jsonb,
'{"rule":"Will vs Going To","explanation":"WILL = prédiction spontanée ou décision soudaine (I think it will rain / I''ll help you!). GOING TO = plan déjà décidé ou prédiction basée sur une preuve (I''m going to study medicine / Look at those clouds — it''s going to rain).","examples":["I think she will win.","We''re going to visit Paris next month.","Watch out! You''re going to fall!"],"questions":[{"id":"g1","q":"I''ve decided: I ___ become a doctor.","choices":["will","am going to","going to","would"],"correct":1,"explanation":"Plan déjà décidé → AM GOING TO."},{"id":"g2","q":"The phone is ringing. I ___ answer it! (décision spontanée)","choices":["am going to","going to","will","would"],"correct":2,"explanation":"Décision spontanée, non planifiée → WILL."},{"id":"g3","q":"Look at those dark clouds! It ___ rain.","choices":["will","is going to","goes to","would"],"correct":1,"explanation":"Preuve visible (nuages sombres) → IS GOING TO."}]}'::jsonb,
'{"transcript":"Hi everyone! My name is Sofia and I want to talk about my future. Next year, I''m going to start secondary school. I''ve already decided: I''m going to study hard and join the science club. I think I''ll probably become a scientist one day. I will never give up on my dreams! What will you do in the future?","questions":[{"id":"l1","q":"What is Sofia going to do next year?","choices":["Start university","Start secondary school","Change city","Learn Arabic"],"correct":1,"explanation":"''I''m going to start secondary school''."},{"id":"l2","q":"What club does Sofia want to join?","choices":["Sports club","Drama club","Science club","Art club"],"correct":2,"explanation":"''I''m going to join the science club''."},{"id":"l3","q":"What does Sofia want to become?","choices":["Teacher","Doctor","Scientist","Engineer"],"correct":2,"explanation":"''I think I''ll probably become a scientist''."}]}'::jsonb,
'[{"id":"r1","q":"I ___ travel to Japan next summer. (plan déjà fait)","choices":["will","am going to","would","shall"],"correct":1,"explanation":"Plan décidé à l''avance → AM GOING TO."},{"id":"r2","q":"I think it ___ be a great film. (prédiction)","choices":["is going to","am going to","will","would"],"correct":2,"explanation":"Prédiction sans preuve → WILL."},{"id":"r3","q":"''Ambitious'' means...","choices":["Paresseux","Ambitieux","Heureux","Triste"],"correct":1,"explanation":"Ambitious = ambitieux, qui veut réussir."}]'::jsonb);

-- ════════════════════════════════════════════════════════════
-- NIVEAU: CHAMPION (B1/B2) | GROUPE: CHAMPION (14–16 ans)
-- Sessions 1-5
-- ════════════════════════════════════════════════════════════

INSERT INTO content_sessions (session_number, level, age_group, title, vocab, grammar, listening, review_questions) VALUES

(1, 'champion', 'champion', 'Perfect Tenses & Time Expressions',
'[
  {"word":"Ubiquitous","translation":"Omniprésent/Partout","example":"Smartphones are ubiquitous today.","emoji":"📱"},
  {"word":"Perceive","translation":"Percevoir/Ressentir","example":"How do you perceive this situation?","emoji":"👁️"},
  {"word":"Consequently","translation":"Par conséquent","example":"He didn''t study; consequently, he failed.","emoji":"⚡"},
  {"word":"Albeit","translation":"Bien que/Quoique","example":"It was a good film, albeit long.","emoji":"📽️"}
]'::jsonb,
'{"rule":"Present Perfect vs Past Simple","explanation":"Present Perfect (have/has + pp) : lien avec le présent, résultat actuel, expérience de vie. Past Simple : action terminée à un moment précis. Marqueurs PP : already, yet, ever, never, just, recently, since, for. Marqueurs PS : yesterday, last year, in 2020, ago.","examples":["I have visited Paris three times. (expérience)","I visited Paris in 2019. (moment précis)","She has just finished her homework. (résultat actuel)"],"questions":[{"id":"g1","q":"I ___ (never/see) such a beautiful painting.","choices":["never saw","have never seen","never seen","didn''t never see"],"correct":1,"explanation":"Expérience de vie + never → HAVE NEVER SEEN (Present Perfect)."},{"id":"g2","q":"She ___ (finish) the project yesterday at 6pm.","choices":["has finished","finished","has finish","had finished"],"correct":1,"explanation":"''Yesterday at 6pm'' = moment précis → Past Simple : FINISHED."},{"id":"g3","q":"They ___ (live) in London for ten years. (ils y vivent toujours)","choices":["lived","have lived","are living","had lived"],"correct":1,"explanation":"Période qui continue jusqu''au présent + for → HAVE LIVED."}]}'::jsonb,
'{"transcript":"The concept of artificial intelligence has been around since the 1950s, but it has only recently become ubiquitous in our daily lives. Researchers have made incredible progress over the past decade. In 2022, ChatGPT was launched and consequently transformed how people perceive AI. Since then, millions of people have started using AI tools for work, education and creativity. Albeit controversial in some circles, AI has undeniably changed the world.","questions":[{"id":"l1","q":"When did AI research begin according to the text?","choices":["1940s","1950s","1960s","1970s"],"correct":1,"explanation":"''AI has been around since the 1950s''."},{"id":"l2","q":"What happened in 2022?","choices":["AI was invented","ChatGPT was launched","AI was banned","Robots were created"],"correct":1,"explanation":"''In 2022, ChatGPT was launched''."},{"id":"l3","q":"What does ''albeit'' mean in the text?","choices":["Therefore","Because","Although","Moreover"],"correct":2,"explanation":"Albeit = bien que, même si (= although)."}]}'::jsonb,
'[{"id":"r1","q":"Have you ever ___ sushi? (manger)","choices":["ate","eat","eaten","eating"],"correct":2,"explanation":"Have + ever + past participle : EATEN."},{"id":"r2","q":"I ___ (just/arrive). I''m tired!","choices":["just arrived","have just arrived","just have arrived","arrived just"],"correct":1,"explanation":"Just + résultat actuel → HAVE JUST ARRIVED."},{"id":"r3","q":"''Consequently'' is a synonym of:","choices":["However","Therefore","Although","Besides"],"correct":1,"explanation":"Consequently = therefore = par conséquent."}]'::jsonb),

(2, 'champion', 'champion', 'Conditionals — Types 1, 2 & 3',
'[
  {"word":"Hypothetical","translation":"Hypothétique","example":"Let''s consider a hypothetical situation.","emoji":"🤔"},
  {"word":"Regret","translation":"Regretter/Regret","example":"I regret not studying harder.","emoji":"😔"},
  {"word":"Feasible","translation":"Faisable/Réalisable","example":"Is this plan feasible?","emoji":"✅"},
  {"word":"Speculate","translation":"Spéculer/Supposer","example":"Scientists speculate about life on Mars.","emoji":"🪐"}
]'::jsonb,
'{"rule":"Les 3 types de conditionnel","explanation":"Type 1 (réel/possible) : If + present simple, will + infinitif. Type 2 (hypothétique/irréel présent) : If + past simple, would + infinitif. Type 3 (irréel passé/regret) : If + past perfect, would have + pp.","examples":["If it rains, I will stay home. (possible)","If I were rich, I would travel the world. (hypothétique)","If she had studied, she would have passed. (regret passé)"],"questions":[{"id":"g1","q":"If you ___ (study) hard, you will pass the exam.","choices":["studied","study","will study","had studied"],"correct":1,"explanation":"Type 1 (situation réelle/possible) : If + PRESENT SIMPLE."},{"id":"g2","q":"If I ___ (be) you, I would apologise immediately.","choices":["am","was","were","had been"],"correct":2,"explanation":"Type 2 (hypothétique) : If + WERE (même pour I)."},{"id":"g3","q":"If she ___ (not/miss) the train, she would have arrived on time.","choices":["didn''t miss","hadn''t missed","hasn''t missed","doesn''t miss"],"correct":1,"explanation":"Type 3 (regret passé) : If + HAD + past participle."}]}'::jsonb,
'{"transcript":"Many scientists speculate about what would happen if humans colonised Mars. If the technology were feasible today, it would take approximately seven months to reach the planet. If early explorers had discovered America using modern GPS, the journey would have been much safer. These hypothetical scenarios help us understand how decisions shape outcomes. What would you do if you could live on another planet?","questions":[{"id":"l1","q":"How long would it take to reach Mars?","choices":["3 months","5 months","7 months","1 year"],"correct":2,"explanation":"''Approximately seven months to reach the planet''."},{"id":"l2","q":"What type of conditional does ''If the technology were feasible today, it would take...'' represent?","choices":["Type 1","Type 2","Type 3","Mixed"],"correct":1,"explanation":"If + past simple (were) + would = Type 2 (hypothétique)."},{"id":"l3","q":"What is the purpose of hypothetical scenarios according to the text?","choices":["Entertainment","Understanding decisions","Predicting weather","Learning history"],"correct":1,"explanation":"''These hypothetical scenarios help us understand how decisions shape outcomes''."}]}'::jsonb,
'[{"id":"r1","q":"If I ___ (win) the lottery, I would give money to charity.","choices":["win","won","had won","will win"],"correct":1,"explanation":"Type 2 (hypothétique) : If + PAST SIMPLE (won)."},{"id":"r2","q":"If you had told me, I ___ (help) you.","choices":["would help","will help","would have helped","had helped"],"correct":2,"explanation":"Type 3 (irréel passé) : would HAVE + pp."},{"id":"r3","q":"''Feasible'' is closest in meaning to:","choices":["Impossible","Achievable","Dangerous","Boring"],"correct":1,"explanation":"Feasible = achievable = faisable, réalisable."}]'::jsonb);
