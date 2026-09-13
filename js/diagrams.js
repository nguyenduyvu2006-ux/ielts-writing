/* IELTS Writing Lab — fixed process diagrams and maps.
 * These are described as data and drawn as SVG in charts.js.
 */
const PROCESS_BANK = [
  { id:'pr1', type:'process', cycle:false,
    para:'how chocolate is produced, from the cacao tree to the finished liquid chocolate',
    title:'The process of making chocolate',
    steps:['Cacao trees grown (tropical regions)','Ripe red pods harvested','Beans removed from pods','Beans fermented (5-7 days)','Beans dried in the sun','Transported to factory','Roasted at 350°C','Shells removed, inner bean crushed','Pressed into liquid chocolate'] },
  { id:'pr2', type:'process', cycle:true,
    para:'the different stages in the life of a frog',
    title:'The life cycle of a frog',
    steps:['Eggs laid in water (frogspawn)','Tadpoles hatch (7-10 days)','Tadpole grows back legs','Front legs develop, tail shrinks','Young frog leaves water','Adult frog returns to lay eggs'] },
  { id:'pr3', type:'process', cycle:true,
    para:'how used glass bottles are turned into new ones',
    title:'How glass bottles are recycled',
    steps:['Used bottles collected from bins','Transported to recycling plant','Sorted by colour & washed','Crushed into small pieces (cullet)','Melted in furnace at 1,500°C','Molten glass moulded into new bottles','New bottles delivered to shops','Sold to consumers'] },
  { id:'pr4', type:'process', cycle:false,
    para:'how hydroelectric power is generated from water stored behind a dam',
    title:'The process of producing electricity from hydropower',
    steps:['Rain fills reservoir behind dam','Water released through intake gate','Water flows down penstock pipe','Turbine spins','Generator converts motion to electricity','Voltage raised by transformer','Electricity sent along power lines','Water returned to river'] },
  { id:'pr5', type:'process', cycle:false,
    para:'the stages involved in producing instant noodles',
    title:'How instant noodles are manufactured',
    steps:['Flour stored in silos','Mixed with water & oil','Dough rolled into sheets','Cut into strips','Strips shaped in noodle discs','Cooked in oil (fried)','Dried and cooled','Packed in cups with vegetables & seasoning','Sealed and labelled'] },
  { id:'pr6', type:'process', cycle:false,
    para:'how bricks are manufactured for use in construction',
    title:'The process of making bricks for the building industry',
    steps:['Clay dug from ground by digger','Clay passed through metal grid','Mixed with sand & water','Shaped in mould or cut by wire','Dried in drying oven (24-48 hrs)','Fired in kiln: 200-980°C','Fired in kiln: 870-1,300°C','Cooled in cooling chamber (48-72 hrs)','Packaged and delivered'] },
];

/* Maps: two panels (before / after). Coordinates on a 0-100 × 0-70 grid.
 * kind: road | green | water | building | beach | label */
const MAP_BANK = [
  { id:'mp1', type:'map', title:'The town of Riverford in 1990 and today',
    para:'how the town of Riverford has changed since 1990',
    panels:[
      { label:'1990', items:[
        {kind:'water',x:0,y:52,w:100,h:18,label:'River'},
        {kind:'road',x:0,y:30,w:100,h:6,label:'Main Road'},
        {kind:'green',x:5,y:5,w:30,h:20,label:'Farmland'},
        {kind:'green',x:40,y:5,w:25,h:20,label:'Woodland'},
        {kind:'building',x:70,y:8,w:22,h:14,label:'Houses'},
        {kind:'building',x:10,y:40,w:18,h:9,label:'Shops'},
        {kind:'building',x:60,y:40,w:14,h:9,label:'Church'},
      ]},
      { label:'Today', items:[
        {kind:'water',x:0,y:52,w:100,h:18,label:'River'},
        {kind:'road',x:0,y:30,w:100,h:6,label:'Main Road'},
        {kind:'road',x:47,y:0,w:6,h:52,label:''},
        {kind:'building',x:5,y:5,w:30,h:20,label:'Housing estate'},
        {kind:'green',x:40,y:5,w:12,h:20,label:'Park'},
        {kind:'building',x:56,y:5,w:12,h:20,label:'Supermarket'},
        {kind:'building',x:70,y:8,w:22,h:14,label:'Houses'},
        {kind:'building',x:10,y:40,w:30,h:9,label:'Shopping centre'},
        {kind:'building',x:60,y:40,w:14,h:9,label:'Church'},
        {kind:'building',x:78,y:40,w:18,h:9,label:'Marina'},
      ]}
    ]},
  { id:'mp2', type:'map', title:'The layout of a university sports centre now and after redevelopment',
    para:'how a university sports centre will look once it has been redeveloped, compared with its current layout',
    panels:[
      { label:'Now', items:[
        {kind:'road',x:0,y:62,w:100,h:8,label:'Road'},
        {kind:'building',x:35,y:15,w:30,h:25,label:'Gym'},
        {kind:'building',x:35,y:42,w:30,h:10,label:'Reception'},
        {kind:'green',x:5,y:5,w:25,h:45,label:'Outdoor courts'},
        {kind:'green',x:70,y:5,w:25,h:45,label:'Outdoor courts'},
        {kind:'building',x:42,y:2,w:16,h:8,label:'Changing rooms'},
      ]},
      { label:'After', items:[
        {kind:'road',x:0,y:62,w:100,h:8,label:'Road'},
        {kind:'building',x:5,y:5,w:25,h:45,label:'Leisure pool'},
        {kind:'building',x:70,y:5,w:25,h:45,label:'Sports hall'},
        {kind:'building',x:35,y:15,w:30,h:25,label:'Gym (extended)'},
        {kind:'building',x:35,y:42,w:30,h:10,label:'Reception & café'},
        {kind:'building',x:32,y:2,w:16,h:8,label:'Changing rooms'},
        {kind:'building',x:52,y:2,w:16,h:8,label:'Dance studio'},
      ]}
    ]},
  { id:'mp3', type:'map', title:'An island before and after the construction of tourist facilities',
    para:'the changes made to an island after tourist facilities were built',
    panels:[
      { label:'Before', items:[
        {kind:'water',x:0,y:0,w:100,h:70,label:''},
        {kind:'green',x:15,y:12,w:70,h:45,label:'Island'},
        {kind:'beach',x:15,y:45,w:70,h:12,label:'Beach'},
        {kind:'green',x:20,y:16,w:20,h:12,label:'Palm trees'},
      ]},
      { label:'After', items:[
        {kind:'water',x:0,y:0,w:100,h:70,label:''},
        {kind:'green',x:15,y:12,w:70,h:45,label:''},
        {kind:'beach',x:15,y:45,w:70,h:12,label:'Beach (swimming)'},
        {kind:'building',x:20,y:16,w:10,h:8,label:'Huts'},
        {kind:'building',x:32,y:16,w:10,h:8,label:'Huts'},
        {kind:'building',x:44,y:18,w:14,h:10,label:'Reception'},
        {kind:'building',x:60,y:16,w:14,h:9,label:'Restaurant'},
        {kind:'building',x:75,y:35,w:8,h:14,label:'Pier'},
        {kind:'road',x:20,y:30,w:50,h:3,label:'Footpath'},
      ]}
    ]},
  { id:'mp4', type:'map', title:'A village school in 2005 and 2025',
    para:'how a village school changed between 2005 and 2025',
    panels:[
      { label:'2005', items:[
        {kind:'road',x:0,y:0,w:100,h:7,label:'Road'},
        {kind:'building',x:10,y:15,w:35,h:15,label:'Main building'},
        {kind:'building',x:10,y:35,w:20,h:10,label:'Hall'},
        {kind:'green',x:55,y:12,w:40,h:40,label:'Sports field'},
        {kind:'road',x:10,y:50,w:35,h:12,label:'Car park'},
      ]},
      { label:'2025', items:[
        {kind:'road',x:0,y:0,w:100,h:7,label:'Road'},
        {kind:'building',x:10,y:15,w:35,h:15,label:'Main building'},
        {kind:'building',x:10,y:35,w:20,h:10,label:'Hall'},
        {kind:'building',x:33,y:35,w:12,h:10,label:'Library'},
        {kind:'building',x:55,y:12,w:18,h:18,label:'Science block'},
        {kind:'green',x:76,y:12,w:19,h:40,label:'Sports field (smaller)'},
        {kind:'building',x:55,y:34,w:18,h:18,label:'Sports hall'},
        {kind:'road',x:10,y:50,w:20,h:12,label:'Car park'},
        {kind:'green',x:33,y:50,w:12,h:12,label:'Garden'},
      ]}
    ]},
  { id:'mp5', type:'map', title:'The centre of Meadowfield in 1980 and 2020',
    para:'how the centre of Meadowfield changed over a forty-year period',
    panels:[
      { label:'1980', items:[
        {kind:'road',x:47,y:0,w:6,h:70,label:'High Street'},
        {kind:'road',x:0,y:32,w:100,h:6,label:'Station Road'},
        {kind:'building',x:5,y:5,w:35,h:20,label:'Factory'},
        {kind:'building',x:60,y:5,w:15,h:20,label:'Shops'},
        {kind:'building',x:5,y:45,w:15,h:15,label:'Post office'},
        {kind:'building',x:60,y:45,w:35,h:15,label:'Railway station'},
        {kind:'green',x:78,y:5,w:17,h:20,label:'Park'},
      ]},
      { label:'2020', items:[
        {kind:'road',x:47,y:0,w:6,h:70,label:'High Street (pedestrian)'},
        {kind:'road',x:0,y:32,w:100,h:6,label:'Station Road'},
        {kind:'building',x:5,y:5,w:35,h:20,label:'Apartments'},
        {kind:'building',x:60,y:5,w:15,h:20,label:'Shops'},
        {kind:'building',x:5,y:45,w:15,h:15,label:'Café'},
        {kind:'building',x:23,y:45,w:18,h:15,label:'Bus station'},
        {kind:'building',x:60,y:45,w:35,h:15,label:'Railway station'},
        {kind:'green',x:78,y:5,w:17,h:20,label:'Park'},
      ]}
    ]},
  { id:'mp6', type:'map', title:'Plans for a new hospital site: proposal A and proposal B',
    para:'two different proposals for the layout of a new hospital site',
    panels:[
      { label:'Proposal A', items:[
        {kind:'road',x:0,y:0,w:100,h:7,label:'Main road'},
        {kind:'building',x:10,y:15,w:40,h:25,label:'Hospital'},
        {kind:'road',x:55,y:15,w:35,h:25,label:'Car park'},
        {kind:'green',x:10,y:45,w:80,h:20,label:'Gardens'},
        {kind:'building',x:0,y:15,w:8,h:25,label:'Bus stop'},
      ]},
      { label:'Proposal B', items:[
        {kind:'road',x:0,y:0,w:100,h:7,label:'Main road'},
        {kind:'building',x:30,y:15,w:40,h:25,label:'Hospital'},
        {kind:'road',x:5,y:15,w:20,h:50,label:'Car park'},
        {kind:'green',x:75,y:15,w:20,h:50,label:'Gardens'},
        {kind:'building',x:30,y:45,w:40,h:20,label:'Outpatient clinic'},
        {kind:'building',x:44,y:8,w:12,h:6,label:'Bus stop'},
      ]}
    ]},
];
