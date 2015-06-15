counterpart = require 'counterpart'
React = require 'react'
Translate = require 'react-translate-component'
AboutSideBar = require '../partials/about-side-bar'
apiClient = require '../api/client'
PromiseRenderer = require '../components/promise-renderer'

counterpart.registerTranslations 'en',
  publications:
    nav:
      space: 'Space'
      climate: 'Climate'
      humanities: 'Humanities'
      nature: 'Nature'
      biology: 'Biology'
      physics: 'Physics'
      meta: 'Meta'
      showAll: 'Show All'

publicationCategories =
  space: [
      {citation: "Galaxy Zoo: the effect of bar-driven fueling on the presence of an active galactic nucleus in disc galaxies, Galloway+ 2015."
      href: "http://arxiv.org/abs/1502.01033"
      slug: "galaxy-zoo"
      },
      {citation: "Galaxy Zoo: Evidence for Diverse Star Formation Histories through the Green Valley, Smethurst+ 2015."
      href: "http://mnras.oxfordjournals.org/content/450/1/435.full.pdf+html"
      slug: "galaxy-zoo"
      },
      {citation: "Galaxy Zoo: the dependence of the star formation-stellar mass relation on spiral disc morphology, Willett+ 2015."
      href: "http://mnras.oxfordjournals.org/cgi/content/full/stv307?ijkey=n2t0XjSn37YTbrU&keytype=ref"
      slug: "galaxy-zoo"
      },
      {citation: "Galaxy Zoo: Are Bars Responsible for the Feeding of Active Galactic Nuclei at 0.2 < z < 1.0?, Cheung+ 2014."
      href: "http://adsabs.harvard.edu/abs/2014arXiv1409.5434C"
      slug: "galaxy-zoo"
      },
      {citation: "Galaxy Zoo: The Ultraviolet Attenuation Law in Backlit Spiral Galaxies, Keel+ 2014."
      href: "http://arxiv.org/abs/1401.0773"
      slug: "galaxy-zoo"
      },
      {citation: "HST Imaging of Fading AGN Candidates I: Host-Galaxy Properties and Origin of the Extended Gas, Keel+ 2014."
      href: "http://arxiv.org/abs/1408.5159"
      slug: "galaxy-zoo"
      },
      {citation: "Galaxy Zoo: an independent look at the evolution of the bar fraction over the last eight billion years from HST-COSMOS, Melvin+ 2014."
      href: "http://mnras.oxfordjournals.org/content/438/4/2882"
      slug: "galaxy-zoo"
      },
      {citation: "The green valley is a red herring: Galaxy Zoo reveals two evolutionary pathways towards quenching of star formation in early- and late-type galaxies, Schawinski+ 2014."
      href: "http://arxiv.org/abs/1402.4814"
      slug: "galaxy-zoo"
      },
      {citation: "Galaxy Zoo: CANDELS barred discs and bar fractions, Simmons+ 2014."
      href: "http://mnras.oxfordjournals.org/content/445/4/3466"
      slug: "galaxy-zoo"
      },
      {citation: "Galaxy Zoo: quantifying morphological indicators of galaxy interaction, Casteels+ 2013."
      href: "http://adsabs.harvard.edu/abs/2013MNRAS.429.1051C"
      slug: "galaxy-zoo"
      },
      {citation: "Galaxy Zoo: Observing Secular Evolution Through Bars, Cheung+ 2013."
      href: "http://arxiv.org/abs/1310.2941"
      slug: "galaxy-zoo"
      },
      {citation: "Galaxy Zoo: A Catalog of Overlapping Galaxy Pairs for Dust Studies, Keel+ 2013."
      href: "http://adsabs.harvard.edu/abs/2013PASP..125....2K"
      slug: "galaxy-zoo"
      },
      {citation: "The different star-formation histories of blue and red spiral and elliptical galaxies, Tojeiro+ 2013."
      href: "http://adsabs.harvard.edu/abs/2013arXiv1303.3551T"
      slug: "galaxy-zoo"
      },
      {citation: "Galaxy Zoo 2: detailed morphological classifications for 304,122 galaxies from the Sloan Digital Sky Survey, Willett+ 2013."
      href: "http://arxiv.org/abs/1308.3496"
      slug: "galaxy-zoo"
      },
      {citation: "Galaxy Zoo: building the low-mass end of the red sequence with local post-starburst galaxies, Wong+ 2013."
      href: "http://adsabs.harvard.edu/abs/2012MNRAS.420.1684W"
      slug: "galaxy-zoo"
      },
      {citation: "Spheroidal post-mergers in the local Universe, Carpineti+ 2012."
      href: "http://adsabs.harvard.edu/abs/2012MNRAS.420.2139C"
      slug: "galaxy-zoo"
      },
      {citation: "Polar ring galaxies in the Galaxy Zoo, Finkelman+ 2012."
      href: "http://adsabs.harvard.edu/abs/2012MNRAS.422.2386F"
      slug: "galaxy-zoo"
      },
      {citation: "The fraction of early-type galaxies in low-redshift groups and clusters of galaxies, Hoyle+ 2012."
      href: "http://adsabs.harvard.edu/abs/2012MNRAS.423.3478H"
      slug: "galaxy-zoo"
      },
      {citation: "Galaxy Zoo: dust and molecular gas in early-type galaxies with prominent dust lanes, Kaviraj+ 2012."
      href: "http://adsabs.harvard.edu/abs/2012MNRAS.423...49K"
      slug: "galaxy-zoo"
      },
      {citation: "The Galaxy Zoo survey for giant AGN-ionized clouds: past and present black hole accretion events, Keel+ 2012."
      href: "http://adsabs.harvard.edu/abs/2012MNRAS.420..878K"
      slug: "galaxy-zoo"
      }
      {citation: "Galaxy Zoo and ALFALFA: atomic gas and the regulation of star formation in barred disc galaxies, Masters+ 2012."
      href: "http://adsabs.harvard.edu/abs/2012MNRAS.424.2180M"
      slug: "galaxy-zoo"
      },
      {citation: "Galaxy Zoo: dust lane early-type galaxies are tracers of recent gas-rich minor mergers, Shabala+ 2012."
      href: "http://adsabs.harvard.edu/abs/2012MNRAS.423...59S"
      slug: "galaxy-zoo"
      }
    ],
  # climate: [
  #   ],
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
    sideBarNavList = counterpart "publications.nav"
    <div className="publications-page">
      <AboutSideBar showList={@showPublicationsList} sideBarNav={sideBarNavList} currentSort={@state.currentSort} translations={counterpart "publications"} />
      <section className="publications-list">
        {for category, publications of publicationCategories
          if @state.currentSort is category
            <ul key={category}>
              {for publication, i in publications
                <li key="publication-#{i}" className="publication-item">
                  <PromiseRenderer promise={apiClient.type('projects').get(slug: publication.slug).get('avatar')} pending={null}
                    then={(avatar) => <img src={avatar.src} alt="Project avatar" />}
                    catch={=> <img src="./assets/simple-pattern.jpg" alt="Placeholder avatar" />} />
                  <strong>{publication.citation}</strong><br />
                  <a href={publication.href} target="_blank">Available here.</a>
                </li>
              }
            </ul>
        }
      </section>
    </div>

  showPublicationsList: (navItem) ->
    currentButton = React.findDOMNode(@refs[navItem])
    @setState currentSort: navItem
