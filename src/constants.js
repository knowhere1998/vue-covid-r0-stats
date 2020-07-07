export default {
	'API_URL': "https://node-covid-data.herokuapp.com",
	'questions' : [
		{
			"question": "What is R<sub>t</sub>/R<sub>0</sub>?",
			"answer": "R<sub>0</sub>, pronounced “R naught,” is a mathematical term that indicates how contagious an infectious disease is. It’s also referred to as the reproduction number. As an infection is transmitted to new people, it reproduces itself."
		},
		{
			"question": "Why R<sub>0</sub>?",
			"answer": "<p>R<sub>0</sub> tells you the average number of people who will contract a contagious disease from one person with that disease. For example, if a disease has an R<sub>0</sub> of 4, a person who has the disease will transmit it to an average of 4 other people. That replication will continue if no one has been vaccinated against the disease or is already immune to it in their community. <a style='color: red; text-decoration: underline red;' href='https://en.wikipedia.org/wiki/Basic_reproduction_number'>Know More</a></p>"
		},
		{
			"question": "What does the 'R<sub>t</sub>' value mean?",
			"answer": "<p>Three possibilities exist for the potential transmission of a disease, depending on the R<sub>t</sub> value:</p>\
				<ul class='list-disc pl-5'> \
					<li> \
					</p>If Rt is less than 1, each existing infection spreads to less than one new infection. This means the desease spread will decline and it will eventually die out.</p> \
					</li> \
					<li> \
					</p>If Rt is 1, each existing infection causes one new infection. This means the \
					desease spread will stay stable but there won't be an outbreak.</p> \
					</li> \
					<li> \
					</p>If Rt is greater than 1, each existing infection spreads to more than one new infection. This means the \
					desease will spread among the community and there may be an outbreak or even a pandemic.</p> \
					</li> \
				</ul> \
				<p>The Rt is only applicable to the population that is completely vulnerable to the disease.</p>"
		},
		{
			"question": "How is it calculated?",
			"answer": "<p>The current model follows the basic formula for calculating values for Rt. To get the average number of the people infected by currently active cases, number of newly detected cases are calcualted for the incubation period and then divided by the number of active cases before the current incubation period cycle. Since the values keep changing as number of active cases grow and decrease over the time, we calculate a rolling average of 4 days to smooth out the Rt Trend in the graph for respective region.</p><p>The data represent here is taken from <a style='color: red; text-decoration: underline red;' href='https://www.covid19india.org/'>covid19india.org</a>, and then processed to sort and accumulate additional information required to calculate these values. Head over to <a style='color: red; text-decoration: underline red;' href='https://node-covid-data.herokuapp.com/'>Data API documentation</a> to know how these values are calculated.</p>"
		},
		{
			"question": "why 15 days?",
			"answer": "<p>Every disease has an infectious disease has an incubation period (time between exposure to the virus and symptom onset) in which signs of infection can be detected in patients. For example, common cold takes 1 to 3 days to show symptoms. For Covid-19 this value ranges between 6 to 14 days. </p>"
		},
		{
			"question": "why are you developing this and why now?",
			"answer": "<p>I was inspired by a post in reddit citing <a style='color: red; text-decoration: underline red;' href='https://www.rt.live/'>rt.live</a> and realized how R<sub>t</sub> stats information gives more information about the spread than the numeric stats.</p>"
		},
		{
			"question": "Where do you get your data from?",
			"answer": "<p>This model is made with use of data from <a style='color: red; text-decoration: underline red;' href='https://www.covid19india.org/'>covid19india.org</a></p>"
		},
		{
			"question": "Can I use this data and if yes, how do I access it?",
			"answer": "<p>You can fetch the compiled data from <a style='color: red; text-decoration: underline red;' href='https://node-covid-data.herokuapp.com/'>Data API</a> which is updated every 24 hours or clone the node application from <a style='color: red; text-decoration: underline red;' href='https://github.com/knowhere1998/node-covid-rt-data/'>Github</a></p>"
		},
	],

	'timeline': {
		"2020-03-25": "Beginning of Lockdown Phase 1",
		"2020-04-15": "Beginning of Lockdown Phase 2",
		"2020-05-04": "Beginning of Lockdown Phase 3",
		"2020-05-18": "Beginning of Lockdown Phase 4",
		"2020-05-31": "End of Lockdown Phase 4",
	},
};