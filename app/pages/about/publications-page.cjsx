counterpart = require 'counterpart'
React = require 'react'
Translate = require 'react-translate-component'
apiClient = require 'panoptes-client/lib/api-client'
Loading = require '../../components/loading-indicator'

counterpart.registerTranslations 'en',
  publications:
    nav:
      showAll: 'Show All'
      space: 'Space'
      climate: 'Climate'
      humanities: 'Humanities'
      nature: 'Nature'
      medicine: 'Medicine'
      meta: 'Meta'
    content:
      header:
        showAll: 'All Publications'

publicationCategories =
  space: [
    {slug: "zooniverse/galaxy-zoo"
    publications: [
      {citation: "Galaxy Zoo: the effect of bar-driven fueling on the presence of an active galactic nucleus in disc galaxies, Galloway+ 2015."
      href: "http://arxiv.org/abs/1502.01033"},
      {citation: "Galaxy Zoo: Evidence for Diverse Star Formation Histories through the Green Valley, Smethurst+ 2015."
      href: "http://mnras.oxfordjournals.org/content/450/1/435.full.pdf+html"},
      {citation: "Galaxy Zoo: the dependence of the star formation-stellar mass relation on spiral disc morphology, Willett+ 2015."
      href: "http://mnras.oxfordjournals.org/cgi/content/full/stv307?ijkey=n2t0XjSn37YTbrU&keytype=ref"},
      {citation: "Galaxy Zoo: Are Bars Responsible for the Feeding of Active Galactic Nuclei at 0.2 < z < 1.0?, Cheung+ 2014."
      href: "http://adsabs.harvard.edu/abs/2014arXiv1409.5434C"},
      {citation: "Galaxy Zoo: The Ultraviolet Attenuation Law in Backlit Spiral Galaxies, Keel+ 2014."
      href: "http://arxiv.org/abs/1401.0773"},
      {citation: "HST Imaging of Fading AGN Candidates I: Host-Galaxy Properties and Origin of the Extended Gas, Keel+ 2014."
      href: "http://arxiv.org/abs/1408.5159"},
      {citation: "Galaxy Zoo: an independent look at the evolution of the bar fraction over the last eight billion years from HST-COSMOS, Melvin+ 2014."
      href: "http://mnras.oxfordjournals.org/content/438/4/2882"},
      {citation: "The green valley is a red herring: Galaxy Zoo reveals two evolutionary pathways towards quenching of star formation in early- and late-type galaxies, Schawinski+ 2014."
      href: "http://arxiv.org/abs/1402.4814"},
      {citation: "Galaxy Zoo: CANDELS barred discs and bar fractions, Simmons+ 2014."
      href: "http://mnras.oxfordjournals.org/content/445/4/3466"},
      {citation: "Galaxy Zoo: quantifying morphological indicators of galaxy interaction, Casteels+ 2013."
      href: "http://adsabs.harvard.edu/abs/2013MNRAS.429.1051C"},
      {citation: "Galaxy Zoo: Observing Secular Evolution Through Bars, Cheung+ 2013."
      href: "http://arxiv.org/abs/1310.2941"},
      {citation: "Galaxy Zoo: A Catalog of Overlapping Galaxy Pairs for Dust Studies, Keel+ 2013."
      href: "http://adsabs.harvard.edu/abs/2013PASP..125....2K"},
      {citation: "The different star-formation histories of blue and red spiral and elliptical galaxies, Tojeiro+ 2013."
      href: "http://adsabs.harvard.edu/abs/2013arXiv1303.3551T"},
      {citation: "Galaxy Zoo 2: detailed morphological classifications for 304,122 galaxies from the Sloan Digital Sky Survey, Willett+ 2013."
      href: "http://arxiv.org/abs/1308.3496"},
      {citation: "Galaxy Zoo: building the low-mass end of the red sequence with local post-starburst galaxies, Wong+ 2013."
      href: "http://adsabs.harvard.edu/abs/2012MNRAS.420.1684W"},
      {citation: "Spheroidal post-mergers in the local Universe, Carpineti+ 2012."
      href: "http://adsabs.harvard.edu/abs/2012MNRAS.420.2139C"},
      {citation: "Polar ring galaxies in the Galaxy Zoo, Finkelman+ 2012."
      href: "http://adsabs.harvard.edu/abs/2012MNRAS.422.2386F"},
      {citation: "The fraction of early-type galaxies in low-redshift groups and clusters of galaxies, Hoyle+ 2012."
      href: "http://adsabs.harvard.edu/abs/2012MNRAS.423.3478H"},
      {citation: "Galaxy Zoo: dust and molecular gas in early-type galaxies with prominent dust lanes, Kaviraj+ 2012."
      href: "http://adsabs.harvard.edu/abs/2012MNRAS.423...49K"},
      {citation: "The Galaxy Zoo survey for giant AGN-ionized clouds: past and present black hole accretion events, Keel+ 2012."
      href: "http://adsabs.harvard.edu/abs/2012MNRAS.420..878K"},
      {citation: "Galaxy Zoo and ALFALFA: atomic gas and the regulation of star formation in barred disc galaxies, Masters+ 2012."
      href: "http://adsabs.harvard.edu/abs/2012MNRAS.424.2180M"},
      {citation: "Galaxy Zoo: dust lane early-type galaxies are tracers of recent gas-rich minor mergers, Shabala+ 2012."
      href: "http://adsabs.harvard.edu/abs/2012MNRAS.423...59S"},
      {citation: "Galaxy Zoo: Bulgeless Galaxies With Growing Black Holes, Simmons+ 2012."
      href: "http://adsabs.harvard.edu/cgi-bin/bib_query?arXiv:1207.4190"},
      {citation: "Galaxy Zoo: the environmental dependence of bars and bulges in disc galaxies, Skibba+ 2012."
      href: "http://adsabs.harvard.edu/abs/2012MNRAS.423.1485S"},
      {citation: "Chandra Observations of Galaxy Zoo Mergers: Frequency of Binary Active Nuclei in Massive Mergers, Teng+ 2012."
      href: "http://adsabs.harvard.edu/abs/2012ApJ...753..165T"},
      {citation: "Galaxy Zoo Volunteers Share Pain and Glory of Research, Clery 2011."
      href: "http://adsabs.harvard.edu/abs/2011Sci...333..173C"},
      {citation: "Galaxy Zoo: multimergers and the Millennium Simulation, Darg+ 2011."
      href: "http://adsabs.harvard.edu/abs/2011MNRAS.416.1745D"},
      {citation: "Galaxy Zoo: bar lengths in local disc galaxies, Hoyle+ 2011."
      href: "http://adsabs.harvard.edu/abs/2011MNRAS.415.3627H"},
      {citation: "Tidal dwarf galaxies in the nearby Universe, Kaviraj+ 2011."
      href: "http://adsabs.harvard.edu/abs/2012MNRAS.419...70K"},
      {citation: "Galaxy Zoo 1: data release of morphological classifications for nearly 900 000 galaxies, Lintott+ 2011."
      href: "http://adsabs.harvard.edu/abs/2011MNRAS.410..166L"},
      {citation: "Galaxy Zoo: bars in disc galaxies, Masters+ 2011."
      href: "http://adsabs.harvard.edu/abs/2011MNRAS.411.2026M"},
      {citation: "Galaxy Zoo Supernovae, Smith+ 2011."
      href: "http://adsabs.harvard.edu/abs/2011MNRAS.412.1309S"},
      {citation: "Galaxy Zoo Morphology and Photometric Redshifts in the Sloan Digital Sky Survey, Way 2011."
      href: "http://adsabs.harvard.edu/abs/2011ApJ...734L...9W"},
      {citation: "Galaxy Zoo: reproducing galaxy morphologies via machine learning, Banerji+ 2010."
      href: "http://adsabs.harvard.edu/abs/2010MNRAS.406..342B"},
      {citation: "Galaxy Zoo: the properties of merging galaxies in the nearby Universe - local environments colours masses star formation rates and AGN activity, Darg+ 2010."
      href: "http://adsabs.harvard.edu/abs/2010MNRAS.401.1552D"},
      {citation: "Galaxy Zoo: the fraction of merging galaxies in the SDSS and their morphologies, Darg+ 2010."
      href: "http://adsabs.harvard.edu/abs/2010MNRAS.401.1043D"},
      {citation: "Galaxy Zoo: a correlation between the coherence of galaxy spin chirality and star formation efficiency, Jimenez+ 2010."
      href: "http://adsabs.harvard.edu/abs/2010MNRAS.404..975J"},
      {citation: "Galaxy Zoo: passive red spirals, Masters+ 2010."
      href: "http://adsabs.harvard.edu/abs/2010MNRAS.405..783M"},
      {citation: "Galaxy Zoo: dust in spiral galaxies, Masters+ 2010."
      href: "http://adsabs.harvard.edu/abs/2010MNRAS.404..792M"},
      {citation: "Galaxy Zoo: The Fundamentally Different Co-Evolution of Supermassive Black Holes and Their Early- and Late-Type Host Galaxies, Schawinski+ 2010."
      href: "http://adsabs.harvard.edu/abs/2010ApJ...711..284S"},
      {citation: "Galaxy Zoo: the dependence of morphology and colour on environment, Bamford+ 2009."
      href: "http://adsabs.harvard.edu/abs/2009MNRAS.393.1324B"},
      {citation: "Galaxy Zoo Green Peas: discovery of a class of compact extremely star-forming galaxies, Cardamone+ 2009."
      href: "http://adsabs.harvard.edu/abs/2009MNRAS.399.1191C"},
      {citation: "Galaxy Zoo: `Hanny's Voorwerp' a quasar light echo?, Lintott+ 2009."
      href: "http://adsabs.harvard.edu/abs/2009MNRAS.399..129L"},
      {citation: "Galaxy Zoo: a sample of blue early-type galaxies at low redshift, Schawinski+ 2009."
      href: "http://adsabs.harvard.edu/abs/2009MNRAS.396..818S"},
      {citation: "Galaxy Zoo: disentangling the environmental dependence of morphology and colour, Skibba+ 2009."
      href: "http://adsabs.harvard.edu/abs/2009MNRAS.399..966S"},
      {citation: "Galaxy Zoo: chiral correlation function of galaxy spins, Slosar+ 2009."
      href: "http://adsabs.harvard.edu/abs/2009MNRAS.392.1225S"},
      {citation: "Galaxy Zoo: the large-scale spin statistics of spiral galaxies in the Sloan Digital Sky Survey, Land+ 2008."
      href: "http://adsabs.harvard.edu/abs/2008MNRAS.388.1686L"},
      {citation: "Galaxy Zoo: morphologies derived from visual inspection of galaxies from the Sloan Digital Sky Survey, Lintott+ 2008."
      href: "http://adsabs.harvard.edu/abs/2008MNRAS.389.1179L"}]
    },
    {slug: "zooniverse/solar-stormwatch"
    publications: [
      {citation: "Differences between the CME fronts tracked by an expert, an automated algorithm, and the Solar Stormwatch project, Barnard+ 2015."
      href: "http://onlinelibrary.wiley.com/doi/10.1002/2015SW001280/full"},
      {citation: "Observational Tracking of the 2D Structure of Coronal Mass Ejections Between the Sun and 1 AU, Savani+ 2015."
      href: "http://arxiv.org/abs/1503.08774"},
      {citation: "Validation of a priori CME arrival predictions made using real-time heliospheric imager observations, Tucker-Hood+ 2015."
      href: "http://onlinelibrary.wiley.com/doi/10.1002/2014SW001106/abstract"},
      {citation: "The Solar Stormwatch CME catalogue: Results from the first space weather citizen science project, Barnard+ 2014."
      href: "http://onlinelibrary.wiley.com/doi/10.1002/2014SW001119/abstract"},
      {citation: "The distribution of interplanetary dust between 0.96 and 1.04 au as inferred from impacts on the STEREO spacecraft observed by the heliospheric imagers, Davis+ 2012."
      href: "http://adsabs.harvard.edu/abs/2012MNRAS.420.1355D"}]
    },
    {slug: "zooniverse/galaxy-zoo-supernova"
    publications: [
      {citation: "Five New Outbursting AM CVn Systems Discovered by the Palomar Transient Factory, Levitan+ 2012."
      href: "http://adsabs.harvard.edu/abs/2012arXiv1212.5312L"},
      {citation: "Hubble Space Telescope studies of low-redshift Type Ia supernovae: evolution with redshift and ultraviolet spectral trends, Maguire+ 2012."
      href: "http://adsabs.harvard.edu/abs/2012MNRAS.426.2359M"},
      {citation: "Dynamic Bayesian Combination of Multiple Imperfect Classifiers, Simpson+ 2012."
      href: "http://adsabs.harvard.edu/abs/2012arXiv1206.1831S"},
      {citation: "PTF10ops - a subluminous, normal-width light curve Type Ia supernova in the middle of nowhere, Maguire+ 2011."
      href: "http://adsabs.harvard.edu/abs/2011MNRAS.418..747M"},
      {citation: "Galaxy Zoo: Supernovae, Smith+ 2011."
      href: "http://adsabs.harvard.edu/abs/2011MNRAS.412.1309S"}]
    },
    {slug: "zooniverse/planet-hunters"
    publications: [
      {citation: "Planet Hunters X: Searching for Nearby Neighbors of 75 Planet and Eclipsing Binary Candidates from the K2 Kepler extended mission, Schmitt+ 2016."
      href: "http://arxiv.org/pdf/1603.06945v1.pdf"},
      {citation: "Planet Hunters. VIII. Characterization of 41 Long-Period Exoplanet Candidates from Kepler Archival Data, Wang+ 2015."
      href: "http://arxiv.org/pdf/1512.02559v2.pdf"},
      {citation: "Planet Hunters. IX. KIC 8462852 – Where’s the flux?, Boyajian+ 2015."
      href: "http://mnras.oxfordjournals.org/content/457/4/3988.full.pdf"},
      {citation: "GALEX J194419.33+491257.0: An unusually active SU UMa-type dwarf nova with a very short orbital period in the Kepler data, Kato & Osaki 2014."
      href: "http://adsabs.harvard.edu/doi/10.1093/pasj/psu025"},
      {citation: "Planet Hunters. VI. An Independent Characterization of KOI-351 and Several Long Period Planet Candidates from the Kepler Archival Data, Schmitt+ 2014."
      href: "http://adsabs.harvard.edu/abs/2013arXiv1310.5912S"},
      {citation: "Planet Hunters. VII. Discovery of a New Low-mass, Low-density Planet (PH3 C) Orbiting Kepler-289 with Mass Measurements of Two Additional Planets (PH3 B and D), Schmitt+ 2014."
      href: "http://adsabs.harvard.edu/cgi-bin/bib_query?arXiv:1410.8114"},
      {citation: "Planet Hunters: KIC 9406652: An Unusual Cataclysmic Variable in the Kepler Field of View, Gies+ 2013."
      href: "http://arxiv.org/abs/1308.0369"},
      {citation: "Planet Hunters: New Kepler planet candidates from analysis of quarter 2, Lintott+ 2013."
      href: "http://iopscience.iop.org/1538-3881/145/6/151/"},
      {citation: "Planet Hunters: A Transiting Circumbinary Planet in a Quadruple Star System, Schwamb+ 2013."
      href: "http://adsabs.harvard.edu/cgi-bin/bib_query?arXiv:1210.3612"},
      {citation: "Planet Hunters V. A Confirmed Jupiter-Size Planet in the Habitable Zone and 42 Planet Candidates from the Kepler Archive Data, Wang+ 2013."
      href: "http://arxiv.org/abs/1301.0644"},
      {citation: "Planet Hunters: the first two planet candidates identified by the public using the Kepler public archive data, Fischer+ 2012."
      href: "http://adsabs.harvard.edu/abs/2012MNRAS.419.2900F"},
      {citation: "Planet Hunters: Assessing the Kepler Inventory of Short-period Planets, Schwamb+ 2012."
      href: "http://adsabs.harvard.edu/abs/2012ApJ...754..129S"}]
    },
    {slug: "zooniverse/milky-way-project"
    publications: [
      {citation: "The Milky Way Project and ATLASGAL: The distribution and physical properties of cold clumps near infrared bubbles, Kendrew+ 2016."
      href: "http://arxiv.org/abs/1602.06982"},
      {citation: "The Milky Way Project: What are Yellowballs?, Kerton+ 2015."
      href: "http://arxiv.org/abs/1502.01388v1"},
      {citation: "The Milky Way Project: Leveraging Citizen Science and Machine Learning to Detect Interstellar Bubbles, Beaumont+ 2014."
      href: "http://arxiv.org/abs/1406.2692"},
      {citation: "The Milky Way Project: A Statistical Study of Massive Star Formation Associated with Infrared Bubbles, Kendrew+ 2012."
      href: "http://adsabs.harvard.edu/abs/2012ApJ...755...71K"},
      {citation: "The Milky Way Project First Data Release: a bubblier Galactic disc, Simpson+ 2012."
      href: "http://mnras.oxfordjournals.org/content/424/4/2442.abstract?sid=4a445f2b-71d6-4865-9e64-3aba88192f61"}]
    },
    {slug: "zooniverse/ice-hunters"
    publications: [
      {citation: "2011 HM102: Discovery of a High-Inclination L5 Neptune Trojan in the Search for a post-Pluto New Horizons Target, Parker+ 2012.",
      href: "http://arxiv.org/abs/1210.4549"}]
    },
    {slug: "zooniverse/andromeda-project"
    publications: [
      {citation: "PHAT Stellar Cluster Survey. II. Andromeda Project Cluster Catalog, Johnson+ 2015."
      href: "http://arxiv.org/abs/1501.04966"}]
    },
    {slug: "zooniverse/space-warps"
    publications: [
      {citation: "Space Warps - II. New gravitational lens candidates from the CFHTLS discovered through citizen science, Marshall+ 2016."
      href: "http://mnras.oxfordjournals.org/content/455/2/1191.full.pdf"},
      {citation: "Space Warps - I. Crowdsourcing the discovery of gravitational lenses, Marshall+ 2016."
      href: "http://mnras.oxfordjournals.org/content/455/2/1171.full.pdf"},
      {citation: "The Red Radio Ring: a gravitationally lensed hyperluminous infrared radio galaxy at z=2.553 discovered through citizen science, Geach+ 2015."
      href: "http://arxiv.org/pdf/1503.05824v1.pdf"},
      {citation: "Gravitational lens modelling in a citizen science context, Küng+ 2015."
      href: "http://arxiv.org/pdf/1502.00008v1.pdf"}]
    },
    {slug: "zooniverse/snapshot-supernova"
    publications: [
      {citation: "ATel #7254: PESSTO spectroscopic classification of optical transients, Campbell+ 2015."
      href: "http://www.astronomerstelegram.org/?read=7254"},
      {citation: "ATel #7261: PESSTO spectroscopic classification of optical transients, Cartier+ 2015."
      href: "http://www.astronomerstelegram.org/?read=7261"}]
    },
    {slug: "zooniverse/radio-galaxy-zoo"
    publications: [
      {citation: "Radio Galaxy Zoo: host galaxies and radio morphologies derived from visual inspection, Banfield+ 2015."
      href: "http://arXiv.org/abs/1507.07272"}]
    }
    {slug: "zooniverse/moon-zoo"
    publications: [
      {citation: "The Moon Zoo citizen science project: Preliminary results for the Apollo 17 landing site, Bugiolacchi+ 2016."
      href: "http://arxiv.org/pdf/1602.01664v1.pdf"}]
    }
  ],
  climate: [
    {slug: "zooniverse/cyclone-center"
    publications: [
      {citation: "Cyclone Center: Can Citizen Scientists Improve Tropical Cyclone Intensity Records?, Hennon+ 2014."
      href: "http://journals.ametsoc.org/doi/abs/10.1175/BAMS-D-13-00152.1"}
    ]}
  ],
  humanities: [
    {slug: "zooniverse/ancient-lives"
    publications: [
      {citation: "A computational pipeline for crowdsourced transcriptions of Ancient Greek papyrus fragments, Williams+ 2014."
      href: "http://ieeexplore.ieee.org/xpl/articleDetails.jsp?reload=true&tp=&arnumber=7004460&queryText%3Dwilliam+alex+pridemore"},
      {citation: "P.Oxy 5156, Plutarch Moralia 660C, 661B-C (Quaestiones Convivales IV PR., 1.2), in The Oxyrhynchus Papyri Vol. 78, Brusuelas 2013."}

    ]}
    {slug: "zooniverse/operation-war-diary"
    publications: [
      {citation: "A Life in the Trenches? The Use of Operation War Diary and Crowdsourcing Methods to Provide an Understanding of the British Army’s Day-to-Day Life on the Western Front, Grayson+ 2016."
      href: "http://bjmh.org.uk/index.php/bjmh/article/view/96"}
    ]}
  ],
  nature: [
    {slug: "zooniverse/whale-fm"
    publications: [
      {citation: "Classification of large acoustic datasets using machine learning and crowdsourcing: Application to whale calls, Shamir+ 2014."
      href: "http://scitation.aip.org/content/asa/journal/jasa/135/2/10.1121/1.4861348"},
      {citation: "Repeated call types in short-finned pilot whales, Globicephala macrorhynchus, Sayigh+ 2012."
      href: "http://onlinelibrary.wiley.com/doi/10.1111/j.1748-7692.2012.00577.x/abstract"}]
    },
    {slug: "zooniverse/snapshot-serengeti"
    publications: [
      {citation: "Applying a random encounter model to estimate lion density from camera traps in Serengeti National Park, Tanzania, Cusack+ 2015."
      href: "http://onlinelibrary.wiley.com/doi/10.1002/jwmg.902/full"},
      {citation: "Snapshot Serengeti, high-frequency annotated camera trap images of 40 mammalian species in an African savanna, Swanson+ 2015."
      href: "http://www.nature.com/articles/sdata201526"
      }]
    }
  ],
  # biology: [
  #   ],
  # physics: [
  #   ],
  medicine: [
    {slug: "zooniverse/cell-slider"
    publications: [
      {citation: "Crowdsourcing the General Public for Large Scale Molecular Pathology Studies in Cancer, Candido dos Reis+ 2015."
      href: "http://www.ebiomedicine.com/article/S2352-3964(15)30016-5/pdf"}]
    },
  ],
  meta: [
    {name: "Meta Studies"
    publications: [
      {citation: "Science Learning via Participation in Online Citizen Science, Masters+ 2016."
      href: "http://arxiv.org/pdf/1601.05973v1.pdf"}
      {citation: "Defining and Measuring Success in Online Citizen Science: A Case Study of Zooniverse Projects, Cox+ 2015."
      href: "http://eprints.whiterose.ac.uk/86535/"}
      {citation: "Designing for Dabblers and Deterring Drop-Outs in Citizen Science, Eveleigh+ 2014."
      href: "http://discovery.ucl.ac.uk/1418573/1/p2985-eveleigh.pdf"}
      {citation: "Playing with science: gamised aspects of gamification found on the Online Citizen Science Project - Zooniverse, Greenhill+ 2014."
      href: "http://eprints.port.ac.uk/15648/"}
      {citation: "Why Won’t Alien’s Talk to Us: Content and Community Dynamics in Online Citizen Science, Luczak-Roesch+ 2014."
      href: "http://www.aaai.org/ocs/index.php/ICWSM/ICWSM14/paper/view/8092"}
      {citation: "Volunteers’ Engagement in Human Computation Astronomy Projects, Ponciano+ 2014."
      href: "http://ieeexplore.ieee.org/xpl/articleDetails.jsp?reload=true&arnumber=6728933"}
      {citation: "Zooniverse: Observing the World’s Largest Citizen Science Platform, Simpson+ 2014."
      href: "http://dl.acm.org/citation.cfm?id=2579215"}
      {citation: '''“I want to be a Captain! I want to be a Captain!": Gamification in the Old Weather citizen science project., Eveleigh+ 2013.'''
      href: "http://discovery.ucl.ac.uk/1412171/"}
      {citation: "Creativity in citizen cyberscience: All for one and one for all, Jennett+ 2013."
      href: "http://ac.aup.fr/~croda/tclab/creativity&attention2013Material/CharleneJennett.pdf"}
      {citation: "Learning by volunteer computing, thinking and gaming: What and how are volunteers learning by participating in Virtual Citizen Science?, Kloetzer+ 2013."
      href: "http://ebwb.hu-berlin.de/aktuelles/esrea/conference-programme/esrea-book-of-abstracts"}
      {citation: "Measuring the Conceptual Understandings of Citizen Scientists Participating in Zooniverse Projects: A First Approach, Prather+ 2013."
      href: "http://www.portico.org/Portico/#!journalAUSimpleView/tab=PDF?cs=ISSN_15391515?ct=E-Journal%20Content?auId=ark:/27927/pgg3ztfcwj0"}
      {citation: "Galaxy Zoo: Motivations of Citizen Scientists, Raddick+ 2013."
      href: "http://arxiv.org/abs/1303.6886"}
      {citation: "Galaxy Zoo: Morphological Classification and Citizen Science, Fortson+ 2012."
      href: "http://labs.adsabs.harvard.edu/adsabs/abs/2012amld.book..213F/"}
      {citation: "Galaxy Zoo: Exploring the Motivations of Citizen Science Volunteers, Raddick+ 2010."
      href: "http://adsabs.harvard.edu/abs/2010AEdRv...9a0103R"}]
    }
  ]

module.exports = React.createClass
  displayName: 'PublicationsPage'

  getInitialState: ->
    currentSort: 'showAll'

  componentDidMount: ->
    @loadProjects()
    document.documentElement.classList.add 'on-secondary-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-secondary-page'

  projectSlugs: ->
    slugs = []
    for category, list of publicationCategories
      slugs = slugs.concat(project.slug for project in list when project.slug)
    slugs

  loadProjects: ->
    apiClient.type('projects').get(slug: @projectSlugs(), cards: true).then (projects) =>
      projectMap = { }
      projectMap[project.slug] = project for project in projects
      @setState projects: projectMap

  render: ->
    sideBarNav = counterpart "publications.nav"
    <div className="publications-page secondary-page-copy">
      <aside className="secondary-page-side-bar">
        <nav ref="sideBarNav">
          {for navItem of sideBarNav
            <button key={navItem} ref={navItem} className="secret-button side-bar-button" style={fontWeight: 700 if @state.currentSort is navItem} onClick={@showPublicationsList.bind(null, navItem)}><Translate content="publications.nav.#{navItem}" /></button>}
        </nav>
      </aside>
      <section className="publications-content">
        <h2>{if @state.currentSort is 'showAll'
              <Translate content="publications.content.header.showAll" />
            else
              @state.currentSort
        }</h2>
        {if @state.projects
          for category, projects of publicationCategories
            if (@state.currentSort is category) or (@state.currentSort is 'showAll')
              <ul key={category} className="publications-list">
                {for projectListing in projects
                  project = @state.projects[projectListing.slug]
                  <div key={projectListing.name or project.slug}>
                    <div>
                      <h3 className="project-name">
                        {if project then project.display_name else projectListing.name}
                      </h3>
                      <span className="publication-count">{' '}({projectListing.publications.length})</span>
                    </div>
                    {projectListing.publications.map (publication) =>
                      i = Math.random()
                      <li key="publication-#{i}" className="publication-item">
                        {@avatarFor(project)}
                        <div className="citation">
                          <p>
                            <cite>{publication.citation}</cite><br />
                            {if publication.href? then <a href={publication.href} target="_blank">Available here.</a>}
                          </p>
                        </div>
                      </li>}
                  </div>
              }</ul>
        else
          <Loading />}
      </section>
    </div>

  showPublicationsList: (navItem) ->
    @setState currentSort: navItem

  avatarFor: (project) ->
    src = if project?.avatar_src
      "//#{ project.avatar_src }"
    else
      './assets/simple-avatar.jpg'
    <img src={src} alt="Project Avatar" />
