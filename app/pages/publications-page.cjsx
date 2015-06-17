counterpart = require 'counterpart'
React = require 'react'
Translate = require 'react-translate-component'
AboutSideBar = require '../partials/about-side-bar'
apiClient = require '../api/client'
PromiseRenderer = require '../components/promise-renderer'

counterpart.registerTranslations 'en',
  publications:
    nav:
      showAll:
        title: 'Show All'
      space:
        title: 'Space'
        projects:
          galaxyZoo: 'Galaxy Zoo'
          solarStormWatch: 'Solar Storm Watch'
          galaxyZooSupernova: 'Galaxy Zoo - Supernova'
          planetHunters: 'Planet Hunters'
          milkyWayProject: 'Milky Way Project'
      climate:
        title: 'Climate'
        projects:
          cycloneCenter: 'Cyclone Center'
      humanities:
        title: 'Humanities'
      nature:
        title: 'Nature'
      biology:
        title: 'Biology'
      physics:
        title: 'Physics'
      meta:
        title: 'Meta'
    content:
      header: 'All Publications'

publicationCategories =
  space: [
    {slug: "galaxy-zoo"
    nav: "galaxyZoo"
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
    {slug: "solar-stormwatch"
    nav: "solarStormWatch"
    publications: [
      {citation: "Observational Tracking of the 2D Structure of Coronal Mass Ejections Between the Sun and 1 AU, Savani+ 2015."
      href: "http://arxiv.org/abs/1503.08774"},
      {citation: "Validation of a priori CME arrival predictions made using real-time heliospheric imager observations, Tucker-Hood+ 2015."
      href: "http://onlinelibrary.wiley.com/doi/10.1002/2014SW001106/abstract"},
      {citation: "The Solar Stormwatch CME catalogue: Results from the first space weather citizen science project, Barnard+ 2014."
      href: "http://onlinelibrary.wiley.com/doi/10.1002/2014SW001119/abstract"},
      {citation: "The distribution of interplanetary dust between 0.96 and 1.04 au as inferred from impacts on the STEREO spacecraft observed by the heliospheric imagers, Davis+ 2012."
      href: "http://adsabs.harvard.edu/abs/2012MNRAS.420.1355D"}]
    },
    {slug: "galaxy-zoo-supernova"
    nav: "galaxyZooSupernova"
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
    {slug: "planet-hunters"
    publications: [
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
    {name: "Milky Way Project"
    nav: "milkyWayProject"
    publications: [
      {citation: "The Milky Way Project: What are Yellowballs?, Kerton+ 2015."
      href: "http://arxiv.org/abs/1502.01388v1"}]
    }
  ],
  climate: [
    {slug: "cyclone-center"
    nav: "cycloneCenter"
    publications: [
      {citation: "Cyclone Center: Can Citizen Scientists Improve Tropical Cyclone Intensity Records?, Hennon+ 2014."
      href: "http://journals.ametsoc.org/doi/abs/10.1175/BAMS-D-13-00152.1"}
    ]}
  ],
  # humanities: [
  #   ],
  # nature: [
  #   ],
  # biology: [
  #   ],
  # physics: [
  #   ],
  # meta: [
  #   ]

module.exports = React.createClass
  displayName: 'PublicationsPage'

  getInitialState: ->
    currentSort: 'showAll'

  render: ->
    <div className="publications-page secondary-page-copy">
      <AboutSideBar showList={@showPublicationsList} sideBarNav={counterpart "publications.nav"} subNav={true} currentSort={@state.currentSort} translations={counterpart "publications"} />
      <section className="publications-content">
        <h2><Translate content="publications.content.header" /></h2>
        {for category, projects of publicationCategories
          if (@state.currentSort is category) or (@state.currentSort is 'showAll')
            console.log 'state', @state.currentSort
            <ul key={category} className="publications-list">
              {for project in projects
                <div key={project.slug || project.name} style={@filterProjects(project.nav) unless (@state.currentSort is category) or (@state.currentSort is 'showAll')}>
                  <PromiseRenderer promise={apiClient.type('projects').get(slug: project.slug)} pending={null} catch={null}>{([fetchedProject]) =>
                    if fetchedProject?
                      <h3 className="project-name">{fetchedProject.display_name}</h3>
                  }</PromiseRenderer>
                  {if project.name then <h3 className="project-name">{project.name}</h3>}<span className="publication-count">{' '}({project.publications.length})</span>
                  {projectAvatar = @getAvatar(project)
                  project.publications.map (publication) =>
                    i = Math.random()
                    <li key="publication-#{i}" className="publication-item">
                      <img src={if projectAvatar? then projectAvatar else "./assets/simple-pattern.jpg"} alt="Project avatar" />
                      <div className="citation">
                        <p>
                          <cite>{publication.citation}</cite><br />
                          <a href={publication.href} target="_blank">Available here.</a>
                        </p>
                      </div>
                    </li>}
                </div>
            }</ul>
        }
      </section>
    </div>

  showPublicationsList: (navItem) ->
    console.log 'clicky', navItem
    currentButton = React.findDOMNode(@refs[navItem])
    @setState currentSort: navItem

  getAvatar: (project) ->
    apiClient.type('projects').get(slug: project.slug).get('avatar')
      .then (avatar) => @avatarSrc = avatar.src
    @avatarSrc

  filterProjects: (filter) ->
    hide = display: "none"
    unless filter is @state.currentSort
      hide
