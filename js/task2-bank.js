/* IELTS Writing Lab — Task 2 question bank */
const TASK2_TYPES = {
  opinion:   'Opinion (Agree / Disagree)',
  discuss:   'Discuss both views',
  problem:   'Problem / Solution',
  advdis:    'Advantages / Disadvantages',
  twopart:   'Two-part question',
};

const TASK2_BANK = [
  // Opinion
  { type:'opinion', topic:'Education', q:'Some people believe that university education should be free for all students. To what extent do you agree or disagree?' },
  { type:'opinion', topic:'Technology', q:'Some people think that the increasing use of computers and mobile phones has had a negative effect on young people\'s reading and writing skills. To what extent do you agree or disagree?' },
  { type:'opinion', topic:'Environment', q:'Governments should spend money on railways rather than roads. To what extent do you agree or disagree?' },
  { type:'opinion', topic:'Health', q:'Some people say that the best way to improve public health is by increasing the number of sports facilities. Others believe this would have little effect. To what extent do you agree or disagree with the first view?' },
  { type:'opinion', topic:'Work', q:'Many people believe that working from home is better for both employees and companies. To what extent do you agree or disagree?' },
  { type:'opinion', topic:'Society', q:'Some people think that the government should be responsible for taking care of the elderly. Others believe families should take on this role. To what extent do you agree with the first view?' },
  { type:'opinion', topic:'Crime', q:'Some people believe that longer prison sentences are the best way to reduce crime. To what extent do you agree or disagree?' },
  { type:'opinion', topic:'Media', q:'Advertising aimed at children should be banned. To what extent do you agree or disagree?' },
  { type:'opinion', topic:'Culture', q:'It is more important for students to learn history than science. To what extent do you agree or disagree?' },

  // Discuss both views
  { type:'discuss', topic:'Education', q:'Some people think that children should start learning a foreign language at primary school, while others believe it is better to begin in secondary school. Discuss both views and give your own opinion.' },
  { type:'discuss', topic:'Work', q:'Some people believe that it is best to stay in one job for a lifetime, while others think that changing jobs frequently is better. Discuss both views and give your opinion.' },
  { type:'discuss', topic:'Environment', q:'Some people think individuals can do little to protect the environment, and only governments and large companies can make a difference. Others disagree. Discuss both views and give your opinion.' },
  { type:'discuss', topic:'Technology', q:'Some people believe that robots will improve our lives in the future, while others think they will be harmful. Discuss both views and give your own opinion.' },
  { type:'discuss', topic:'Society', q:'Some people think that living in a big city is better, while others prefer life in the countryside. Discuss both views and give your opinion.' },
  { type:'discuss', topic:'Culture', q:'Some people think that museums should be free, while others believe visitors should pay an entrance fee. Discuss both views and give your opinion.' },
  { type:'discuss', topic:'Health', q:'Some people believe that the government should regulate unhealthy food, while others think this is the individual\'s responsibility. Discuss both views and give your opinion.' },
  { type:'discuss', topic:'Family', q:'Some people think parents should decide how their children spend their free time, while others think children should choose for themselves. Discuss both views and give your opinion.' },

  // Problem / solution
  { type:'problem', topic:'Environment', q:'Many cities around the world suffer from serious air pollution. What are the causes of this problem, and what measures could be taken to solve it?' },
  { type:'problem', topic:'Society', q:'An increasing number of people are moving from rural areas to cities. What problems does this cause, and how can they be solved?' },
  { type:'problem', topic:'Health', q:'Obesity is a growing problem in many countries. What are the causes of this, and what solutions can you suggest?' },
  { type:'problem', topic:'Technology', q:'Many people today spend too much time on social media. What problems does this cause, and what can be done about it?' },
  { type:'problem', topic:'Education', q:'In some countries, many students leave school without basic skills. Why is this happening, and what can be done to address it?' },
  { type:'problem', topic:'Traffic', q:'Traffic congestion is becoming worse in many cities. What are the causes, and what solutions can governments introduce?' },
  { type:'problem', topic:'Work', q:'Stress at work is a serious issue in many countries. What are the reasons for this, and what can employers do to reduce it?' },

  // Advantages / disadvantages
  { type:'advdis', topic:'Education', q:'Some students choose to take a gap year between school and university. What are the advantages and disadvantages of doing this?' },
  { type:'advdis', topic:'Technology', q:'More and more people are shopping online instead of in shops. Do the advantages of this development outweigh the disadvantages?' },
  { type:'advdis', topic:'Work', q:'In many countries, people are retiring at a later age. Do the advantages of this outweigh the disadvantages?' },
  { type:'advdis', topic:'Travel', q:'International tourism has grown enormously in recent decades. Do the advantages of this outweigh the disadvantages?' },
  { type:'advdis', topic:'Society', q:'In some countries, more and more people choose to live alone. What are the advantages and disadvantages of this trend?' },
  { type:'advdis', topic:'Culture', q:'English is becoming the dominant global language. Do the advantages of this outweigh the disadvantages?' },
  { type:'advdis', topic:'Family', q:'Many parents today allow their children to use tablets and smartphones from a very young age. What are the advantages and disadvantages of this?' },

  // Two-part
  { type:'twopart', topic:'Technology', q:'Nowadays people can work and study from anywhere thanks to technology. Why is this happening? Is it a positive or negative development?' },
  { type:'twopart', topic:'Society', q:'In many countries, the number of people getting married is falling. Why is this the case? Is this a positive or negative development?' },
  { type:'twopart', topic:'Environment', q:'Some people say that plastic bags should be banned. Why do people use plastic bags? What could replace them?' },
  { type:'twopart', topic:'Health', q:'People today are living longer than ever before. What are the reasons for this? What effects does this have on society?' },
  { type:'twopart', topic:'Education', q:'Many young people today choose to study abroad. Why is this? Do you think the benefits outweigh the drawbacks?' },
  { type:'twopart', topic:'Culture', q:'Fewer young people are taking part in traditional customs and festivals. Why is this happening? What can be done to encourage them?' },
  { type:'twopart', topic:'Work', q:'Many people prefer to buy products made in their own country. Why might this be? Is this a positive or negative trend?' },
];
