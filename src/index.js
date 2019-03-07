import "./styles.css";
import wdk from "wikidata-sdk";
//import { SparqlEndpointFetcher } from "fetch-sparql-endpoint";

const signum = "u";
const sparql = `
SELECT DISTINCT ?Runic_inscriptions ?Runic_inscriptionsLabel ?Swedish_Open_Cultural_Heritage_URI ?placering ?placeringLabel ?Samnordisk_runtextdatabas_signum WHERE {
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
  ?Runic_inscriptions wdt:P31 wd:Q7379880.
  ?Runic_inscriptions wdt:P1261 ?Samnordisk_runtextdatabas_signum.
  ?Runic_inscriptions wdt:P1260 ?Swedish_Open_Cultural_Heritage_URI.
  filter contains( lcase(?Samnordisk_runtextdatabas_signum), "${signum}"
  ).
  OPTIONAL { ?Runic_inscriptions wdt:P276 ?placering. }
  OPTIONAL { 
    ?Runic_inscriptions wdt:P1261 ?Samnordisk_runtextdatabas_signum.
  }
}
LIMIT 100
`;
const url = wdk.sparqlQuery(sparql);

//document.getElementById("app").innerHTML = `${sparql}`;

const getFetch = async () => {
  try {
    let result = await fetch(url);
    const getJson = await result.json();
    //const postsList = await JSON.stringify(getJson);
    const list = getJson.results.bindings.map(
      item =>
        `<li><h1>${item.Samnordisk_runtextdatabas_signum.value}</h1><p>${
          item.placeringLabel.value
        }</p></li>`
    );
    document.getElementById("app").innerHTML = `<ul>${list.join("")}</ul>`;
    console.table(getJson);
    // document.getElementById("app").innerHTML = `${postsList}`;
  } catch (error) {
    console.log("error", error);
  }
};
getFetch();
