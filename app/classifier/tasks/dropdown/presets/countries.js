// using ISO 3166-1 numeric codes for country's value

var countries = [
  {
    label: "Afghanistan",
    value: "004"
  },
  {
    label: "Åland Islands",
    value: "248"
  },
  {
    label: "Albania",
    value: "008"
  },
  {
    label: "Algeria",
    value: "012"
  },
  {
    label: "American Samoa",
    value: "016"
  },
  {
    label: "Andorra",
    value: "020"
  },
  {
    label: "Angola",
    value: "024"
  },
  {
    label: "Anguilla",
    value: "660"
  },
  {
    label: "Antarctica",
    value: "010"
  },
  {
    label: "Antigua and Barbuda",
    value: "028"
  },
  {
    label: "Argentina",
    value: "032"
  },
  {
    label: "Armenia",
    value: "051"
  },
  {
    label: "Aruba",
    value: "533"
  },
  {
    label: "Australia",
    value: "036"
  },
  {
    label: "Austria",
    value: "040"
  },
  {
    label: "Azerbaijan",
    value: "031"
  },
  {
    label: "Bahamas",
    value: "044"
  },
  {
    label: "Bahrain",
    value: "048"
  },
  {
    label: "Bangladesh",
    value: "050"
  },
  {
    label: "Barbados",
    value: "052"
  },
  {
    label: "Belarus",
    value: "112"
  },
  {
    label: "Belgium",
    value: "056"
  },
  {
    label: "Belize",
    value: "084"
  },
  {
    label: "Benin",
    value: "204"
  },
  {
    label: "Bermuda",
    value: "060"
  },
  {
    label: "Bhutan",
    value: "064"
  },
  {
    label: "Bolivia (Plurinational State of)",
    value: "068"
  },
  {
    label: "Bonaire, Sint Eustatius and Saba",
    value: "535"
  },
  {
    label: "Bosnia and Herzegovina",
    value: "070"
  },
  {
    label: "Botswana",
    value: "072"
  },
  {
    label: "Bouvet Island",
    value: "074"
  },
  {
    label: "Brazil",
    value: "076"
  },
  {
    label: "British Indian Ocean Territory",
    value: "086"
  },
  {
    label: "Brunei Darussalam",
    value: "096"
  },
  {
    label: "Bulgaria",
    value: "100"
  },
  {
    label: "Burkina Faso",
    value: "854"
  },
  {
    label: "Burundi",
    value: "108"
  },
  {
    label: "Cambodia",
    value: "116"
  },
  {
    label: "Cameroon",
    value: "120"
  },
  {
    label: "Canada",
    value: "124"
  },
  {
    label: "Cabo Verde",
    value: "132"
  },
  {
    label: "Cayman Islands",
    value: "136"
  },
  {
    label: "Central African Republic",
    value: "140"
  },
  {
    label: "Chad",
    value: "148"
  },
  {
    label: "Chile",
    value: "152"
  },
  {
    label: "China",
    value: "156"
  },
  {
    label: "Christmas Island",
    value: "162"
  },
  {
    label: "Cocos (Keeling) Islands",
    value: "166"
  },
  {
    label: "Colombia",
    value: "170"
  },
  {
    label: "Comoros",
    value: "174"
  },
  {
    label: "Congo",
    value: "178"
  },
  {
    label: "Congo (Democratic Republic of the)",
    value: "180"
  },
  {
    label: "Cook Islands",
    value: "184"
  },
  {
    label: "Costa Rica",
    value: "188"
  },
  {
    label: "Côte d'Ivoire",
    value: "384"
  },
  {
    label: "Croatia",
    value: "191"
  },
  {
    label: "Cuba",
    value: "192"
  },
  {
    label: "Curaçao",
    value: "531"
  },
  {
    label: "Cyprus",
    value: "196"
  },
  {
    label: "Czech Republic",
    value: "203"
  },
  {
    label: "Denmark",
    value: "208"
  },
  {
    label: "Djibouti",
    value: "262"
  },
  {
    label: "Dominica",
    value: "212"
  },
  {
    label: "Dominican Republic",
    value: "214"
  },
  {
    label: "Ecuador",
    value: "218"
  },
  {
    label: "Egypt",
    value: "818"
  },
  {
    label: "El Salvador",
    value: "222"
  },
  {
    label: "Equatorial Guinea",
    value: "226"
  },
  {
    label: "Eritrea",
    value: "232"
  },
  {
    label: "Estonia",
    value: "233"
  },
  {
    label: "Ethiopia",
    value: "231"
  },
  {
    label: "Falkland Islands (Malvinas)",
    value: "238"
  },
  {
    label: "Faroe Islands",
    value: "234"
  },
  {
    label: "Fiji",
    value: "242"
  },
  {
    label: "Finland",
    value: "246"
  },
  {
    label: "France",
    value: "250"
  },
  {
    label: "French Guiana",
    value: "254"
  },
  {
    label: "French Polynesia",
    value: "258"
  },
  {
    label: "French Southern Territories",
    value: "260"
  },
  {
    label: "Gabon",
    value: "266"
  },
  {
    label: "Gambia",
    value: "270"
  },
  {
    label: "Georgia",
    value: "268"
  },
  {
    label: "Germany",
    value: "276"
  },
  {
    label: "Ghana",
    value: "288"
  },
  {
    label: "Gibraltar",
    value: "292"
  },
  {
    label: "Greece",
    value: "300"
  },
  {
    label: "Greenland",
    value: "304"
  },
  {
    label: "Grenada",
    value: "308"
  },
  {
    label: "Guadeloupe",
    value: "312"
  },
  {
    label: "Guam",
    value: "316"
  },
  {
    label: "Guatemala",
    value: "320"
  },
  {
    label: "Guernsey",
    value: "831"
  },
  {
    label: "Guinea",
    value: "324"
  },
  {
    label: "Guinea-Bissau",
    value: "624"
  },
  {
    label: "Guyana",
    value: "328"
  },
  {
    label: "Haiti",
    value: "332"
  },
  {
    label: "Heard Island and McDonald Islands",
    value: "334"
  },
  {
    label: "Holy See",
    value: "336"
  },
  {
    label: "Honduras",
    value: "340"
  },
  {
    label: "Hong Kong",
    value: "344"
  },
  {
    label: "Hungary",
    value: "348"
  },
  {
    label: "Iceland",
    value: "352"
  },
  {
    label: "India",
    value: "356"
  },
  {
    label: "Indonesia",
    value: "360"
  },
  {
    label: "Iran (Islamic Republic of)",
    value: "364"
  },
  {
    label: "Iraq",
    value: "368"
  },
  {
    label: "Ireland",
    value: "372"
  },
  {
    label: "Isle of Man",
    value: "833"
  },
  {
    label: "Israel",
    value: "376"
  },
  {
    label: "Italy",
    value: "380"
  },
  {
    label: "Jamaica",
    value: "388"
  },
  {
    label: "Japan",
    value: "392"
  },
  {
    label: "Jersey",
    value: "832"
  },
  {
    label: "Jordan",
    value: "400"
  },
  {
    label: "Kazakhstan",
    value: "398"
  },
  {
    label: "Kenya",
    value: "404"
  },
  {
    label: "Kiribati",
    value: "296"
  },
  {
    label: "Korea (Democratic People's Republic of)",
    value: "408"
  },
  {
    label: "Korea (Republic of)",
    value: "410"
  },
  {
    label: "Kuwait",
    value: "414"
  },
  {
    label: "Kyrgyzstan",
    value: "417"
  },
  {
    label: "Lao People's Democratic Republic",
    value: "418"
  },
  {
    label: "Latvia",
    value: "428"
  },
  {
    label: "Lebanon",
    value: "422"
  },
  {
    label: "Lesotho",
    value: "426"
  },
  {
    label: "Liberia",
    value: "430"
  },
  {
    label: "Libya",
    value: "434"
  },
  {
    label: "Liechtenstein",
    value: "438"
  },
  {
    label: "Lithuania",
    value: "440"
  },
  {
    label: "Luxembourg",
    value: "442"
  },
  {
    label: "Macao",
    value: "446"
  },
  {
    label: "Macedonia (the former Yugoslav Republic of)",
    value: "807"
  },
  {
    label: "Madagascar",
    value: "450"
  },
  {
    label: "Malawi",
    value: "454"
  },
  {
    label: "Malaysia",
    value: "458"
  },
  {
    label: "Maldives",
    value: "462"
  },
  {
    label: "Mali",
    value: "466"
  },
  {
    label: "Malta",
    value: "470"
  },
  {
    label: "Marshall Islands",
    value: "584"
  },
  {
    label: "Martinique",
    value: "474"
  },
  {
    label: "Mauritania",
    value: "478"
  },
  {
    label: "Mauritius",
    value: "480"
  },
  {
    label: "Mayotte",
    value: "175"
  },
  {
    label: "Mexico",
    value: "484"
  },
  {
    label: "Micronesia (Federated States of)",
    value: "583"
  },
  {
    label: "Moldova (Republic of)",
    value: "498"
  },
  {
    label: "Monaco",
    value: "492"
  },
  {
    label: "Mongolia",
    value: "496"
  },
  {
    label: "Montenegro",
    value: "499"
  },
  {
    label: "Montserrat",
    value: "500"
  },
  {
    label: "Morocco",
    value: "504"
  },
  {
    label: "Mozambique",
    value: "508"
  },
  {
    label: "Myanmar",
    value: "104"
  },
  {
    label: "Namibia",
    value: "516"
  },
  {
    label: "Nauru",
    value: "520"
  },
  {
    label: "Nepal",
    value: "524"
  },
  {
    label: "Netherlands",
    value: "528"
  },
  {
    label: "New Caledonia",
    value: "540"
  },
  {
    label: "New Zealand",
    value: "554"
  },
  {
    label: "Nicaragua",
    value: "558"
  },
  {
    label: "Niger",
    value: "562"
  },
  {
    label: "Nigeria",
    value: "566"
  },
  {
    label: "Niue",
    value: "570"
  },
  {
    label: "Norfolk Island",
    value: "574"
  },
  {
    label: "Northern Mariana Islands",
    value: "580"
  },
  {
    label: "Norway",
    value: "578"
  },
  {
    label: "Oman",
    value: "512"
  },
  {
    label: "Pakistan",
    value: "586"
  },
  {
    label: "Palau",
    value: "585"
  },
  {
    label: "Palestine, State of",
    value: "275"
  },
  {
    label: "Panama",
    value: "591"
  },
  {
    label: "Papua New Guinea",
    value: "598"
  },
  {
    label: "Paraguay",
    value: "600"
  },
  {
    label: "Peru",
    value: "604"
  },
  {
    label: "Philippines",
    value: "608"
  },
  {
    label: "Pitcairn",
    value: "612"
  },
  {
    label: "Poland",
    value: "616"
  },
  {
    label: "Portugal",
    value: "620"
  },
  {
    label: "Puerto Rico",
    value: "630"
  },
  {
    label: "Qatar",
    value: "634"
  },
  {
    label: "Réunion",
    value: "638"
  },
  {
    label: "Romania",
    value: "642"
  },
  {
    label: "Russian Federation",
    value: "643"
  },
  {
    label: "Rwanda",
    value: "646"
  },
  {
    label: "Saint Barthélemy",
    value: "652"
  },
  {
    label: "Saint Helena, Ascension and Tristan da Cunha",
    value: "654"
  },
  {
    label: "Saint Kitts and Nevis",
    value: "659"
  },
  {
    label: "Saint Lucia",
    value: "662"
  },
  {
    label: "Saint Martin (French part)",
    value: "663"
  },
  {
    label: "Saint Pierre and Miquelon",
    value: "666"
  },
  {
    label: "Saint Vincent and the Grenadines",
    value: "670"
  },
  {
    label: "Samoa",
    value: "882"
  },
  {
    label: "San Marino",
    value: "674"
  },
  {
    label: "Sao Tome and Principe",
    value: "678"
  },
  {
    label: "Saudi Arabia",
    value: "682"
  },
  {
    label: "Senegal",
    value: "686"
  },
  {
    label: "Serbia",
    value: "688"
  },
  {
    label: "Seychelles",
    value: "690"
  },
  {
    label: "Sierra Leone",
    value: "694"
  },
  {
    label: "Singapore",
    value: "702"
  },
  {
    label: "Sint Maarten (Dutch part)",
    value: "534"
  },
  {
    label: "Slovakia",
    value: "703"
  },
  {
    label: "Slovenia",
    value: "705"
  },
  {
    label: "Solomon Islands",
    value: "090"
  },
  {
    label: "Somalia",
    value: "706"
  },
  {
    label: "South Africa",
    value: "710"
  },
  {
    label: "South Georgia and the South Sandwich Islands",
    value: "239"
  },
  {
    label: "South Sudan",
    value: "728"
  },
  {
    label: "Spain",
    value: "724"
  },
  {
    label: "Sri Lanka",
    value: "144"
  },
  {
    label: "Sudan",
    value: "729"
  },
  {
    label: "Suriname",
    value: "740"
  },
  {
    label: "Svalbard and Jan Mayen",
    value: "744"
  },
  {
    label: "Swaziland",
    value: "748"
  },
  {
    label: "Sweden",
    value: "752"
  },
  {
    label: "Switzerland",
    value: "756"
  },
  {
    label: "Syrian Arab Republic",
    value: "760"
  },
  {
    label: "Taiwan, Province of China",
    value: "158"
  },
  {
    label: "Tajikistan",
    value: "762"
  },
  {
    label: "Tanzania, United Republic of",
    value: "834"
  },
  {
    label: "Thailand",
    value: "764"
  },
  {
    label: "Timor-Leste",
    value: "626"
  },
  {
    label: "Togo",
    value: "768"
  },
  {
    label: "Tokelau",
    value: "772"
  },
  {
    label: "Tonga",
    value: "776"
  },
  {
    label: "Trinidad and Tobago",
    value: "780"
  },
  {
    label: "Tunisia",
    value: "788"
  },
  {
    label: "Turkey",
    value: "792"
  },
  {
    label: "Turkmenistan",
    value: "795"
  },
  {
    label: "Turks and Caicos Islands",
    value: "796"
  },
  {
    label: "Tuvalu",
    value: "798"
  },
  {
    label: "Uganda",
    value: "800"
  },
  {
    label: "Ukraine",
    value: "804"
  },
  {
    label: "United Arab Emirates",
    value: "784"
  },
  {
    label: "United Kingdom of Great Britain and Northern Ireland",
    value: "826"
  },
  {
    label: "United States of America",
    value: "840"
  },
  {
    label: "United States Minor Outlying Islands",
    value: "581"
  },
  {
    label: "Uruguay",
    value: "858"
  },
  {
    label: "Uzbekistan",
    value: "860"
  },
  {
    label: "Vanuatu",
    value: "548"
  },
  {
    label: "Venezuela (Bolivarian Republic of)",
    value: "862"
  },
  {
    label: "Viet Nam",
    value: "704"
  },
  {
    label: "Virgin Islands (British)",
    value: "092"
  },
  {
    label: "Virgin Islands (U.S.)",
    value: "850"
  },
  {
    label: "Wallis and Futuna",
    value: "876"
  },
  {
    label: "Western Sahara",
    value: "732"
  },
  {
    label: "Yemen",
    value: "887"
  },
  {
    label: "Zambia",
    value: "894"
  },
  {
    label: "Zimbabwe",
    value: "716"
  }
]

module.exports = countries;
