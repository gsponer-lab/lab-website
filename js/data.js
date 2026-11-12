const PAGES = ['home','publications','people','software','databases','news'];

/* Site content. Edit people, publications, news, software and databases here. */
const PI = {
  name: 'Jörg Gsponer', role: 'Principal Investigator · Professor · Department Head, Biochemistry & Molecular Biology', photo: '',
  bio: [
    'Jörg Gsponer is Professor and Head of the Department of Biochemistry and Molecular Biology at UBC, with a joint appointment at the Michael Smith Laboratories. He holds an MD from the University of Lausanne and a PhD in biochemistry from the University of Zurich, and trained at the University of Cambridge as a postdoctoral fellow and then MRC research fellow at the Laboratory of Molecular Biology.',
    'He joined UBC in 2009 and became a full professor in 2021. As PI he leads the lab\'s computational work on AI based protein design, intrinsically disordered regions, protein based bioinformatics, molecular dynamics, cellular regulation and control and more.'
  ],
  email: 'gsponer@msl.ubc.ca', linkedin: 'https://www.linkedin.com/in/j%C3%B6rg-gsponer-66020983/', office: 'MSL 179 · Lab MSL 183', honours: '2025 NSERC Discovery Grant; NFRF Exploration grant'
};
const GROUPS = [
  { title: 'Research staff', people: [
    { name: 'Jennifer M. Bui', role: 'Research Associate', photo: '', email: '', linkedin: '',
      bio: 'Computational chemist (PhD, UC San Diego, 2006; BS Physical Chemistry, UC Davis, 1998). Works on protein structure, protein–protein interactions, molecular dynamics and amyloids.' },
  ]},
  { title: 'PhD students', people: [
    { name: 'Alireza Omidi', role: 'PhD Candidate, Bioinformatics', photo: '', email: 'aomidi@student.ubc.ca', linkedin: 'https://www.linkedin.com/in/aomidi',
      bio: 'Builds generative models for protein design, using diffusion and flow matching to design mini-protein binders, and uses large language models to improve protein design and interaction prediction. First author of the PNAS study on AlphaFold-Multimer and disordered regions. MSc in Artificial Intelligence, Sharif University of Technology.' }
  ]},
  { title: "Master's students", people: [
    { name: 'Juan Pablo Iglesias Ahualli', role: "Master's student, Biochemistry & Molecular Biology", photo: '', email: '', linkedin: '',
      bio: 'Came to UBC as an Erasmus exchange student and returned for graduate study. Co-author of the 2025 Communications Chemistry paper testing AlphaFold on proteins with large-scale allosteric transitions.' },
    { name: 'Sofie Hooft Toomey', role: "Master's student, Bioinformatics", photo: '', email: '', linkedin: '',
      bio: '' },
    { name: 'Ryan Kaffashi', role: "Master's student", photo: '', email: '', linkedin: '',
      bio: '' }
  ]},
  { title: 'Undergraduate students', people: [
    { name: 'Varun Sharma', role: 'Undergraduate student', photo: '', email: '', linkedin: '', bio: '' }
  ]}
];
const PUBS = [
 [2026,'Omidi A, He J, Bui JM, Gsponer J, Syed S','De novo design of protein switches with diffusion-based ensemble sampling','bioRxiv preprint','https://www.biorxiv.org/content/10.64898/2026.07.20.739027v1'],
 [2026,'Omidi A, He J, Gsponer J, Syed S','METALICA: METAdynamics and repLICA exchange for enhanced diffusion sampling','arXiv preprint','https://scholar.google.com/citations?view_op=view_citation&hl=en&user=AObjzWEAAAAJ&citation_for_view=AObjzWEAAAAJ:YOwf2qJgpHMC'],
 [2026,'Malhis N, Gsponer J','Predicting molecular recognition features in protein sequences with MoRFchibi 2.0','BMC Bioinformatics (in press)','https://link.springer.com/article/10.1186/s12859-026-06532-x'],
 [2026,'Omidi A, Bui JA, Gsponer J','Predicting protein interfaces in the age of AlphaFold: Why dynamics and disorder remain a challenge','Cell Systems 17(1):101508','https://www.cell.com/cell-systems/abstract/S2405-4712(25)00341-2'],
 [2026,'Cen HH, Mattison AJ, Omidi A, Rogalski J, Abraham L, Gao G, Gold MR, Foster LJ, Gsponer J, Johnson JD','Insulin receptor trafficking and interactions in muscle cells','J Endocr Soc 10(4):bvag020','https://academic.oup.com/jes/article/10/4/bvag020/8443044'],
 [2025,'Pinette NC, Terrado M, Bui JM, Lallous N, Gsponer J','Next-generation predictors of protein phase behavior','Curr Opin Struct Biol 96:103197','https://www.sciencedirect.com/science/article/pii/S0959440X25002155'],
 [2025,'Perkins-Jechow BH, Iglesias Ahualli JP, Nhu TH, Omidi A, Li C, Holguin-Cruz J, Cho D, Na D, Malhis N, Bui JM, Gsponer J','Challenging AlphaFold in predicting proteins with large-scale allosteric transitions','Commun Chem 8(1):378','https://www.nature.com/articles/s42004-025-01763-0'],
 [2025,'Tran KM, Nong NT, Ren J, Lee K, Lee D, Gsponer J, Lee H, Na D','Genetic "expiry-date" circuits control lifespan of synthetic scavenger bacteria for safe bioremediation','Nucleic Acids Res 53(14):gkaf703','https://academic.oup.com/nar/article/53/14/gkaf703/8211935','img/pubs/pub7.jpg'],
 [2025,'Cheung YWS, Nam S, Fairlie GM, Scheu K, Bui JM, Shariati HR, Gsponer J, Yip CK','Structure of the human autophagy factor EPG5 and the molecular basis of its conserved mode of interaction with Atg8-family proteins','Autophagy 14:1-19','https://www.tandfonline.com/doi/full/10.1080/15548627.2024.2447213'],
 [2025,'Malhis N, Gsponer J','Computational prediction of linear interacting peptides','Methods Mol Biol 2867:233-245','https://link.springer.com/protocol/10.1007/978-1-0716-4196-5_14'],
 [2024,'Omidi A, Harder Møller M, Malhis N, Bui JA, Gsponer J','AlphaFold-Multimer accurately captures interactions and dynamics of intrinsically disordered protein regions','PNAS 121(44):e2406407121','https://www.pnas.org/doi/10.1073/pnas.2406407121'],
 [2024,'Cho D, Lee HM, Kim JA, Song JG, Hwang SH, Lee B, Park J, Tran KM, Kim J, Vo PNL, Bae J, Pimt T, Lee K, Gsponer J, Kim HW, Na D','Autoinhibited Protein Database: a curated database of autoinhibitory domains and their autoinhibition mechanisms','Database 2024:baae085','https://academic.oup.com/database/article/doi/10.1093/database/baae085/7742849'],
 [2024,'Holguin-Cruz JA, Bui JA, Jha A, Na D, Gsponer J','Widespread alteration of protein autoinhibition in human cancers','Cell Systems 15(3):246-263.e7','https://www.sciencedirect.com/science/article/pii/S2405471224000309'],
 [2024,'Basu S, Zhao B, Biró B, Faraggi E, Gsponer J, Hu G, Kloczkowski A, Malhis N, Mirdita M, Söding J, Steinegger M, Wang D, Wang K, Xu D, Zhang J, Kurgan L','DescribePROT in 2023: more, higher-quality and experimental annotations and improved data download options','Nucleic Acids Res 52(D1):D426-D433','https://academic.oup.com/nar/article/52/D1/D426/7337615','img/pubs/pub13.jpg'],
 [2023,'Na D, Lim DH, Hong JS, Lee HM, Cho D, Yu MS, Shaker B, Ren J, Lee B, Song JG, Oh J, Lee K, Oh KS, Lee MY, Choi MS, Choi HS, Kim YH, Bui JM, Lee K, Kim HW, Lee YS, Gsponer J','A multi-layered network expansion model identifies Akt1 as common modulator of neurodegeneration','Mol Syst Biol 19(12):e11801','https://www.embopress.org/doi/full/10.15252/msb.202311801'],
 [2023,'Molzahn C, Kuechler E, Zemlyankina I, Nieves L, Ali T, Cole G, Wang J, Albu RF, Zhu M, Cashman N, Gilch S, Karsan A, Lange PF, Gsponer J, Mayor T','Shift of the insoluble content of the proteome in aging mouse brain','PNAS 120(45):e2310057120','https://www.pnas.org/doi/10.1073/pnas.2310057120'],
 [2023,'Kurgan L, Hu G, Wang K, Ghadermarzi S, Zhao B, Malhis N, Erdős G, Gsponer J, Uversky VN, Dosztányi Z','Tutorial: a guide for the selection of fast and accurate computational tools for the prediction of intrinsic disorder in proteins','Nat Protoc 18(11):3157-3172','https://www.nature.com/articles/s41596-023-00876-x'],
 [2023,'Del Conte A, Bouhraoua A, Mehdiabadi M, Clementel D, Monzon AM, CAID predictors, Tosatto SCE, Piovesan D','CAID prediction portal: a comprehensive service for predicting intrinsic disorder and binding regions in proteins','Nucleic Acids Res 51(W1):W62-W69','https://academic.oup.com/nar/article/51/W1/W62/7184153','img/pubs/pub17.jpg'],
 [2023,'Basu S, Gsponer J, Kurgan L','DEPICTER2: a comprehensive webserver for intrinsic disorder and disorder function prediction','Nucleic Acids Res 51(W1):W141-W147','https://academic.oup.com/nar/article/51/W1/W141/7151337','img/pubs/pub18.jpg'],
 [2023,'Sun C, Seranova E, Cohen MA, Chipara M, Roberts J, Palhegyi AM, Acharjee A, Sedlackova L, Kataura T, Otten EG, Panda PK, Kauffman KJ, Huerta-Uribe A, Zatyka M, Silva LFSE, Torresi J, Zhang S, Ward C, Kuechler ER, Cartwright D, Trushin S, Trushina E, Sahay G, Buganim Y, Lavery GG, Gsponer J, Anderson DG, Rosenstock TR, Barrett T, Maddocks ODK, Tennant DA, Wang H, Jaenisch R, Korolchuk VI, Sarkar S','NAD depletion mediates cytotoxicity in human neurons with autophagy deficiency','Cell Rep 42(5):112372','https://www.cell.com/cell-reports/fulltext/S2211-1247(23)00383-2'],
 [2023,'Kuechler ER, Huang A, Bui JM, Mayor T, Gsponer J','Comparison of biomolecular condensate localization and protein phase separation predictors','Biomolecules 13(3):527','https://www.mdpi.com/2218-273X/13/3/527'],
 [2023,'Boeynaems S, Chong S, Gsponer J, Holt L, Milovanovic D, Mitrea DM, Mueller-Cajar O, Portz B, Reilly JF, Reinkemeier CD, Sabari BR, Sanulli S, Shorter J, Sontag E, Strader L, Stachowiak J, Weber SC, White M, Zhang H, Zweckstetter M, Elbaum-Garfinkle S, Kriwacki R','Phase separation in biology and disease; current perspectives and open questions','J Mol Biol 435(5):167971','https://www.sciencedirect.com/science/article/pii/S002228362300027X'],
 [2022,'Zhang F, Biswas M, Massah S, Lee J, Lingadahalli S, Wong S, Wells C, Foo J, Khan N, Morin H, Saxena N, Kung S, Sun B, Parra-Nunez AK, Sanchez C, Chan N, Ung L, Altıntas UB, Bui JM, Wang Y, Fazli L, Oo HZ, Rennie PS, Lack NA, Cherkasov A, Gleave ME, Gsponer J, Lallous N','Dynamic phase separation of the androgen receptor and its coactivators key to regulate gene expression','Nucleic Acids Res (online)','https://academic.oup.com/nar/advance-article/doi/10.1093/nar/gkac1158/6931870'],
 [2022,'Zhu M, Kuechler ER, Wong RYK, Calabrese G, Sitarik IM, Rana V, Stoynov N, O\'Brien EP, Gsponer J, Mayor T','Pulse labeling reveals the tail end of protein folding by proteome profiling','Cell Rep 40(3):111096','https://www.sciencedirect.com/science/article/pii/S2211124722008981'],
 [2022,'Holguin-Cruz JA, Foster LJ, Gsponer J','Where protein structure and cell diversity meet','Trends Cell Biol 32(12):996-1007','https://www.sciencedirect.com/science/article/pii/S0962892422000927'],
 [2022,'Kuechler ER, Jacobson M, Mayor T, Gsponer J','GraPES: the Granule Protein Enrichment Server for prediction of biological condensate constituents','Nucleic Acids Res 50:W384-W391','https://academic.oup.com/nar/advance-article/doi/10.1093/nar/gkac279/6574678'],
 [2021,'Skinnider MA, Acott ES, Prudova A, Kerr CH, Stonynov N, Stancey RG, Chan QWT, Rattray D, Gsponer J, Foster LJ','An atlas of protein-protein interactions across mouse tissues','Cell 184(15):4073-4089','https://www.cell.com/cell/fulltext/S0092-8674(21)00704-2']
];
const NEWS = [
 [2026,'Alireza Omidi presenting at MSL Seminar','MSL Seminar - Research Stories Mini-Symposium\nWednesday, November 18, 3pm PCT\nMSL Lecture Theatre (room 102) and Zoom\nHost: Dr. Sabrina Leslie\nThe goal of the Research Stories Mini-Symposium is to celebrate trainees with recent publications while also discussing the research journeys behind their work. We’re going to hear from speakers about challenges, pivots, unexpected findings, collaborations, and impact – not just data.\nThis seminar will be presented in a hybrid format. Audience members are welcome to attend either in person or via the zoom link. Those connecting via zoom will be able to ask questions during the Q&A portion using the chat function.\nZoom registration link: https://ubc.zoom.us/meeting/register/4e9n1GgESuOiuDGCYs7j9w\nSeminar schedule:\nTalk 1: Alireza Omidi - Gsponer Lab\nMETALICA: METAdynamics and repLICA exchange for enhanced diffusion sampling\nTalk 2: Yao Zhang - Leslie Lab\nIncreasing Lipid Nanoparticle mRNA Copy Number Improves Transfection Potency\nTalk 3: Xueru Liu - Li Lab\nFrom genetic screen to immune signaling: Uncovering the role of LURP1 in plant defense\nTalk 4: Beatrix Wang - Miller Lab\nSingle-cell multiomic approaches define a gradual, spatially regulated epigenetic and transcriptional transition from embryonic to adult neural stem cells'],
 [2026,'Anthropic x Adaptyv Protein Design Competition','https://www.linkedin.com/feed/update/urn:li:activity:7525691607824695298/'],
 [2026,'CIHR Grant Award','https://www.msl.ubc.ca/msl-faculty-spring-2026-cihr/'],
 [2026,'MoRFchibi 2.0 published','Malhis and Gsponer present MoRFchibi 2.0, which outperforms existing predictors of protein-binding sites in disordered regions. BMC Bioinformatics.'],
 [2026,'Review in Cell Systems','Omidi, Bui and Gsponer examine why dynamics and disorder remain a challenge for predicting protein interfaces in the age of AlphaFold.'],
 [2025,'NSERC Discovery Grant','Dr. Gsponer received a 2025 NSERC Discovery Grant.'],
 [2025,'AlphaFold and allosteric transitions','Communications Chemistry paper testing AlphaFold on proteins with large-scale allosteric transitions.']
];
const SW = [
 ['GraPES','Granule Protein Enrichment Server. Predicts which proteins are constituents of biological condensates.','https://grapes.msl.ubc.ca',''],
 ['MoRFchibi','Computational prediction of molecular recognition features (MoRFs) in protein sequences. Version 2.0 published 2026.','https://gsponerlab.msl.ubc.ca/software/morf_chibi/',''],
 ['IDRBind','Protein interface predictor for binding sites of intrinsically disordered regions, with a focus on MoRFs.','https://gsponerlab.msl.ubc.ca/software/idrbind/',''],
 ['LIST','Local Identity and Shared Taxa. Generates position conservation matrices for human protein sequences in FASTA format.','https://gsponerlab.msl.ubc.ca/software/list',''],
 ['MLnet','Multi-layered network expansion model to identify common genetic modifiers across multiple diseases.','','Link on the old site points to a bare IP address and needs IT review.'],
 ['Cis-regPred','A predictor of cis-regulatory elements.','https://gsponerlab.msl.ubc.ca/cis-regpred/',''],
 ['Categorizer','A tool for classifying genes into user-defined categories.','https://gsponerlab.msl.ubc.ca/software/categorizer/',''],
 ['Easyworm','Software to determine the mechanical properties of worm-like chains.','https://gsponerlab.msl.ubc.ca/software/easyworm/','']
];
const DB = [
 ['Mouse Interactome','The mouse tissue interactome explorer, a project of the Foster and Gsponer laboratories at UBC. Based on an atlas of protein-protein interactions across mouse tissues.','https://tissue-interactomes.msl.ubc.ca',''],
];
