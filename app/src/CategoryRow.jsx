import React from 'react';
import { Link } from 'react-router-dom';

import CategoryRowSocialLinks from './CategoryRowSocialLinks';

export default function CategoryRow(props) {
  const features = props.data.features;
  const data = props.data;
  if (data.isLoading()) return;

//  console.log("props: ");
//  console.log(props);
//  console.log("props.data: ");
//  console.log(props.data);
//  console.log("props.item: ");
//  console.log(props.item);
//  console.log("features ");
//  console.log(features);

  const item = props.item;
  const t = props.t;
  const k = props.k;
  const v = props.v;

  // filters (used here for highlighting)
  const tt = ((data.filters && data.filters.tt) || '').toLowerCase().trim();
  const cc = ((data.filters && data.filters.cc) || '').toLowerCase().trim();

  const rowClasses = [];
  if (item.filtered) rowClasses.push('hide');
  if (item.selected) rowClasses.push('selected');

  // setup defaults for this tree..
  let n, kvn, count, tags, qid, overpassQuery;

  if (t === 'brands') {
    n = item.tags.brand || item.tags.name;
    kvn = `${k}/${v}|${n}`;
    count = data.brandCounts[kvn] || '< 50';
    tags = item.tags || {};
    qid = tags['brand:wikidata'];
    let bn = tags['brand'];
    overpassQuery = `[out:json][timeout:100];
(nwr["name"="${n}"];);
out body;
>;
out skel qt;

{{style:
node[name=${n}],
way[name=${n}],
relation[name=${n}]
{ color:red; fill-color:red; }
node[${k}=${v}][name=${n}],
way[${k}=${v}][name=${n}],
relation[${k}=${v}][name=${n}]
{ color:yellow; fill-color:yellow; }
node[${k}=${v}][name=${n}][brand=${bn}][brand:wikidata=${qid}],
way[${k}=${v}][name=${n}][brand=${bn}][brand:wikidata=${qid}],
relation[${k}=${v}][name=${n}][brand=${bn}][brand:wikidata=${qid}]
{ color:green; fill-color:green; }
}}`;

  } else if (t === 'flags') {
    n = item.tags['flag:name'];
    kvn = `${k}/${v}|${n}`;
    count = null;
    tags = item.tags || {};
    qid = tags['flag:wikidata'];
    overpassQuery = `[out:json][timeout:100];
(nwr["flag:name"="${n}"];);
out body;
>;
out skel qt;`;

  } else if (t === 'operators') {
    n = item.tags.operator;
    kvn = `${k}/${v}|${n}`;
    count = data.operatorCounts[kvn] || '< 10';
    tags = item.tags || {};
    qid = tags['operator:wikidata'];
    overpassQuery = `[out:json][timeout:100];
(nwr["operator"="${n}"];);
out body;
>;
out skel qt;

{{style:
node[operator=${n}],
way[operator=${n}],
relation[operator=${n}]
{ color:red; fill-color:red; }
node[${k}=${v}][operator=${n}],
way[${k}=${v}][operator=${n}],
relation[${k}=${v}][operator=${n}]
{ color:yellow; fill-color:yellow; }
node[${k}=${v}][operator=${n}][operator:wikidata=${qid}],
way[${k}=${v}][operator=${n}][operator:wikidata=${qid}],
relation[${k}=${v}][operator=${n}][operator:wikidata=${qid}]
{ color:green; fill-color:green; }
}}`;

  } else if (t === 'transit') {
    n = item.tags.network;
    kvn = `${k}/${v}|${n}`;
    count = data.transitCounts[kvn] || '< 10';
    tags = item.tags || {};
    qid = tags['network:wikidata'];
    overpassQuery = `[out:json][timeout:100];
(nwr["network"="${n}"];);
out body;
>;
out skel qt;

{{style:
node[network=${n}],
way[network=${n}],
relation[network=${n}]
{ color:red; fill-color:red; }
node[${k}=${v}][network=${n}],
way[${k}=${v}][network=${n}],
relation[${k}=${v}][network=${n}]
{ color:yellow; fill-color:yellow; }
node[${k}=${v}][network=${n}][network:wikidata=${qid}],
way[${k}=${v}][network=${n}][network:wikidata=${qid}],
relation[${k}=${v}][network=${n}][network:wikidata=${qid}]
{ color:green; fill-color:green; }
}}`;
  }

  const wd = data.wikidata[qid] || {};
  const label = wd.label || '';
  const description = wd.description ? '"' + wd.description + '"' : '';
  const identities = wd.identities || {};
  const logos = wd.logos || {};

  if (t === 'flags') {
    return (
      <tr className={rowClasses.join(' ') || null} >
      <td className='namesuggest'>
        <h3 className='slug' id={item.slug}>
          <a href={`#${item.slug}`}>#</a>
          <span className='anchor'>{item.displayName}</span>
        </h3>
        <div className='nsikey'><pre>{item.id}</pre></div>
        <div className='locations'>{ locoDisplay(item.locationSet, n) }</div>
        <div className='viewlink'>
          { searchOverpassLink(n, overpassQuery) }<br/>
          { searchGoogleLink(n) }<br/>
          { searchWikipediaLink(n) }
        </div>
      </td>
      <td className='tags'>
        <pre className='tags' dangerouslySetInnerHTML={ highlight(tt, displayTags(tags)) } />
        <hr/>
      </td>
      <td className='wikidata'>
        <h3>{label}</h3>
        <span>{description}</span><br/>
        { wdLink(qid) }
        { siteLink(identities.website) }
      </td>
      <td className='logo'>{ logo(logos.wikidata) }</td>
      </tr>
    );
  } else {
    return (
      <tr className={rowClasses.join(' ') || null} >
      <td className='namesuggest'>
        <h3 className='slug' id={item.slug}>
          <a href={`#${item.slug}`}>#</a>
          <span className='anchor'>{item.displayName}</span>
        </h3>
        <div className='nsikey'><pre>{item.id}</pre></div>
        <div className='locations'>{ locoDisplay(item.locationSet, n) }</div>
        <div className='viewlink'>
          { searchOverpassLink(n, overpassQuery) }<br/>
          { searchGoogleLink(n) }<br/>
          { searchWikipediaLink(n) }
        </div>
      </td>
      <td className='count'>{count}</td>
      <td className='tags'>
        <pre className='tags' dangerouslySetInnerHTML={ highlight(tt, displayTags(tags)) } />
        <hr/>
      </td>
      <td className='wikidata'>
        <h3>{label}</h3>
        <span>{description}</span><br/>
        { wdLink(qid) }
        { siteLink(identities.website) }
        <CategoryRowSocialLinks {...identities} />
        { buildOverpassTurbo(item,features,t,k,v) }
      </td>
      <td className='logo'>{ logo(logos.wikidata) }</td>
      <td className='logo'>{ fblogo(identities.facebook, logos.facebook) }</td>
      <td className='logo'>{ logo(logos.twitter) }</td>
      </tr>
    );
  }


  function locoDisplay(locationSet, name) {
    const val = JSON.stringify(locationSet);
    const q = encodeURIComponent(val);
    const href = `https://ideditor.github.io/location-conflation/?referrer=nsi&locationSet=${q}`;
    const title = `View LocationSet for ${name}`;
    return val && (
      <a target='_blank' href={href} title={title}><code dangerouslySetInnerHTML={ highlight(cc, val) } /></a>
    );
  }


  function highlight(needle, haystack) {
    let html = haystack;
    if (needle) {
      const re = new RegExp('\(' + needle + '\)', 'gi');
      html = html.replace(re, '<mark>$1</mark>');
    }
    return  { __html: html };
  }


  function searchGoogleLink(name) {
    const q = encodeURIComponent(name);
    const href = `https://google.com/search?q=${q}`;
    const title = `Search Google for ${name}`;
    return (<a target='_blank' href={href} title={title}>Search Google</a>);
  }

  function searchWikipediaLink(name) {
    const q = encodeURIComponent(name);
    const href = `https://google.com/search?q=${q}+site%3Awikipedia.org`;
    const title = `Search Wikipedia for ${name}`;
    return (<a target='_blank' href={href} title={title}>Search Wikipedia</a>);
  }


  function searchOverpassLink(name, overpassQuery) {
    const q = encodeURIComponent(overpassQuery);
    const href = `https://overpass-turbo.eu/?Q=${q}&R`;
    const title = `Search Overpass Turbo for ${n}`;
    return (<a target='_blank' href={href} title={title}>Search Overpass Turbo (basic search)</a>);
  }

  function fblogo(username, src) {
    return (username && !src) ? <span>Profile restricted</span> : logo(src);
  }


  function logo(src) {
    return src && (
      <img className='logo' src={src}/>
    );
  }

  function wdLink(qid) {
    const href = `https://www.wikidata.org/wiki/${qid}`;
    return qid && (
      <div className='viewlink'>
      <a target='_blank' href={href}>{qid}</a>
      </div>
    );
  }


  function siteLink(href) {
    return href && (
      <div className='viewlink'>
      <a target='_blank' href={href}>{href}</a>
      </div>
    );
  }


  function displayTags(tags) {
    let result = '';
    Object.keys(tags).forEach(k => {
      result += `${k}=${tags[k]}
`;
    });
    return result;
  }

};

  function buildOverpassTurbo(itemData,features,t,k,v) {
    let locationSet           = itemData.locationSet.include; // locationSet data should always exist as an array.
    let locJSON               = features;
    let matchNames            = "";
    let name                  = "";
    let brand                 = "";
    let brandWikidata         = "";
    let operator              = "";
    let operatorWikidata      = "";
    let styling               = "";
    let searchArea            = ""; // Should remain blank unless searchArea is being used.
    let radius                = "25000"; // 25km radius, same as location-conflation radius.
    let overpassKey           = "";
    let overpassValue         = "";
    let overpassWikidata      = "";
    let OverpassTurboQueryURI = "";
    let OverpassTurboQuery    = "[out:json][timeout:100];\n"

    console.log("== START ===============================================");
//    console.log("t: " + t);
//    console.log("k: " + k);
//    console.log("v: " + v);
    console.log("== %c" + itemData.displayName,"color:green;");
//    console.log("locationSet typeof: " + typeof locationSet);
//    console.log(locationSet);
//    console.log("locationSet[0] typeof: " + typeof locationSet[0]);
//    console.log(locationSet[0]);
//    console.log("locJSON typeof: " + typeof locJSON);
//    console.log(locJSON);
//    console.log("locJSON.features typeof: " + typeof locJSON.features);
//    console.log(locJSON.features);
//    console.log("locJSON.features.length: " + locJSON.features.length);
//    console.log("locJSON.features[0] typeof: " + typeof locJSON.features[0]);
//    console.log(locJSON.features[0]);
//    console.log("locJSON.features[0].id typeof: " + typeof locJSON.features[0].id);
//    console.log(locJSON.features[0].id);
//    console.log("locJSON.features[0].geometry typeof: " + typeof locJSON.features[0].geometry);
//    console.log(locJSON.features[0].geometry);
//    console.log("locJSON.features[0].geometry.coordinates typeof: " + typeof locJSON.features[0].geometry.coordinates);
//    console.log(locJSON.features[0].geometry.coordinates);
console.log(JSON.stringify(locJSON));

    // Build a basic location search if locationSet isn't set to world (001)
    // or doesn't include a custom .geojson file.
      console.log("locationSet[0]: " + locationSet[0] + " (" + typeof locationSet[0] + ")");
    if (locationSet[0] != "001") {
      console.log("locationSet isn't 001 and so isn't global.");
      console.log("locationSet[0]: " + locationSet[0] + " (" + typeof locationSet[0] + ")");
//      if ((locationSet[0] instanceof String) && (locationSet[0].endsWith(".geojson"))) {
//      if (locationSet[0].endsWith(".geojson")) {
      if ((typeof locationSet[0] !== "object") && (locationSet[0].endsWith(".geojson"))) {
        console.log("%cPOLY SEARCH ...","color:red;");
      console.log(locationSet[0] + " (" + typeof locationSet[0] + ")");

        let i,ii,thisJSON;
        for (i=0; i<locJSON.features.length; i++) {
//          console.log(i);
//          console.log(locJSON.features[i].id);
          console.log("i: " + i + ", ID: " + locJSON.features[i].id);
//          console.log(locJSON.features[i].geometry.coordinates);
//          console.log(" ");

          if (locationSet[0] == locJSON.features[i].id) {
            console.log("  " + locationSet[0] + " matches " + locJSON.features[i].id + " so look through coords.");
            console.log("  coord sets: " + locJSON.features[i].geometry.coordinates.length);
            console.log("  coord pairs: " + locJSON.features[i].geometry.coordinates[0].length);
            searchArea  = "(poly:\"";
            console.log("  inside ii loop, main i is: " + i);
            for (ii=0; (ii<locJSON.features[i].geometry.coordinates[0].length-1); ii++) {

              console.log("    ii: " + ii);
              searchArea += locJSON.features[i].geometry.coordinates[0][ii][1];
              searchArea += " ";
              searchArea += locJSON.features[i].geometry.coordinates[0][ii][0];
              console.log("    " + searchArea);
              if (ii<(locJSON.features[i].geometry.coordinates[0].length - 2)) {
                searchArea += " ";
                console.log("    Added End blank.");
              }
            }
            searchArea += "\");\n  /* Search area using: " + locationSet[0] + " */\n";
            console.log("");
            console.log("    Final Poly search query: " + searchArea);
          }
        }
      } else if ((typeof locationSet[0] === "object") && (!isNaN(locationSet[0][0]))) {
        console.log("RADIUS SEARCH ...");

        // locationSet Array within an Array & is a number, so likely GPS / Radius combo.
        // OverpassTurbo uses "around" function, but requires coords to be swapped.
        searchArea = "(around:" + radius + "," + locationSet[0][1] + "," + locationSet[0][0] + ");";
      } else {
        console.log("AREA SEARCH ...");
        searchArea = "(area.searchArea);";
        OverpassTurboQuery += "(\n";

        // Loop through each location, check to see if it's one that
        // OverpassTurbo doesn't recognise, and swap in one that it does.
        let i,thisLocation;
        for (i=0; i<locationSet.length; i++) {
          thisLocation = locationSet[i];

          // Check unsupported locations.
          if (thisLocation == "gb-wls") // change 'gb-wls' to 'Wales'.
            thisLocation = "Wales";
          if (thisLocation == "gb-sct") // change 'gb-sct' to 'Scotland'.
            thisLocation = "Scotland";
          if (thisLocation == "gb-nir") // change 'gb-nir' to 'Northern Ireland'.
            thisLocation = "Northern Ireland";
          if (thisLocation == "conus") // change 'conus' to 'USA'.
            thisLocation = "USA";

          // Add 'geocodeArea' for this location
          OverpassTurboQuery += "  {{geocodeArea:" + thisLocation + "}};\n";
        }
        OverpassTurboQuery += ")->.searchArea;\n";
      }
    } else {
      console.log("locationSet is 001 and so is global.");
      searchArea = ";";
    }


    OverpassTurboQuery += "(\n";

    // Include any 'matchNames' as a name search.
    if (itemData.matchNames) {
      matchNames = itemData.matchNames;

      let i;

      OverpassTurboQuery += "  // matchNames search:\n";
      for (i=0; i<matchNames.length; i++)
        OverpassTurboQuery += "  nwr[\"name\"=\"" + matchNames[i] + "\"]" + searchArea + "\n";
      OverpassTurboQuery += "\n";
    }

    if (itemData.tags.name)
	name = itemData.tags.name;
    else
	name = "none set";

    if (itemData.tags.operator)
	operator = itemData.tags.operator;
    else
	operator = "none set";

    if (itemData.tags.brand)
	brand = itemData.tags.brand;
    else
	brand = "none set";

    if (itemData.tags['brand:wikidata'])
	brandWikidata = itemData.tags['brand:wikidata'];
    else
	brandWikidata = "none set";

    if (itemData.tags['operator:wikidata'])
	operatorWikidata = itemData.tags['operator:wikidata'];
    else
	operatorWikidata = "none set";


    if (name != "none set")
      OverpassTurboQuery += "  nwr[\"name\"=\"" + name + "\"]" + searchArea + "\n";
      overpassKey      = "name";       // Set as the word "name".
      overpassValue    = name;         // Set as the value of "name".
    if (brand != "none set")
      OverpassTurboQuery += "  nwr[\"brand\"=\"" + brand + "\"]" + searchArea + "\n";
      overpassKey      = "brand";       // Set as the word "brand".
      overpassValue    = brand;         // Set as the value of "brand".
      overpassWikidata = brandWikidata; // Set as the value of "brand:wikidata".
    if (operator != "none set") {
      OverpassTurboQuery += "  nwr[\"operator\"=\"" + operator + "\"]" + searchArea + "\n";
      overpassKey      = "operator";       // Set as the word "operator".
      overpassValue    = operator;         // Set as the value of "operator".
      overpassWikidata = operatorWikidata; // Set as the value of "operator:wikidata".
    }

    OverpassTurboQuery += ");\nout body;\n>;\nout skel qt;\n\n";

    styling += "{{style:\n";
    styling += "  node,way,relation\n";
    styling += "  { color:gray; fill-color:gray; }\n";
//    styling += "  /* Gray items might be part of the same brand,*/\n  /* but not the same name or type.*/\n\n";
    styling += "  /* Gray items match one more more item,*/\n  /* but not all, and could be an incorrect match.*/\n\n";
    styling += "  node[" + overpassKey + "=" + overpassValue + "],\n";
    styling += "  way[" + overpassKey + "=" + overpassValue + "],\n";
    styling += "  relation[" + overpassKey + "=" + overpassValue + "]\n";
//    styling += "  node[name=" + name + "],\n";
//    styling += "  way[name=" + name + "],\n";
//    styling += "  relation[name=" + name + "]\n";
    styling += "  { color:red; fill-color:red; }\n";
    styling += "  /* Red items might be the same name,*/\n  /* but not the same type or brand.*/\n\n";
    styling += "  node[" + k + "=" + v + "][" + overpassKey + "=" + overpassValue + "],\n";
    styling += "  way[" + k + "=" + v + "][" + overpassKey + "=" + overpassValue + "],\n";
    styling += "  relation[" + k + "=" + v + "][" + overpassKey + "=" + overpassValue + "]\n";
//    styling += "  node[" + k + "=" + v + "][name=" + name + "],\n";
//    styling += "  way[" + k + "=" + v + "][name=" + name + "],\n";
//    styling += "  relation[" + k + "=" + v + "][name=" + name + "]\n";
    styling += "  { color:pink; fill-color:pink; }\n";
    styling += "  /* Blue items might be the same name and type,*/\n  /* but missing the correct brand.*/\n\n";
    styling += "  node[" + k + "=" + v + "][" + overpassKey + "=" + overpassValue + "][" + overpassKey + ":wikidata=" + overpassWikidata + "],\n";
    styling += "  way[" + k + "=" + v + "][" + overpassKey + "=" + overpassValue + "][" + overpassKey + ":wikidata=" + overpassWikidata + "],\n";
    styling += "  relation[" + k + "=" + v + "][" + overpassKey + "=" + overpassValue + "][" + overpassKey + ":wikidata=" + overpassWikidata + "]\n";
//    styling += "  node[" + k + "=" + v + "][name=" + name + "][brand=" + brand + "][brand:wikidata=" + brandWikidata + "],\n";
//    styling += "  way[" + k + "=" + v + "][name=" + name + "][brand=" + brand + "][brand:wikidata=" + brandWikidata + "],\n";
//    styling += "  relation[" + k + "=" + v + "][name=" + name + "][brand=" + brand + "][brand:wikidata=" + brandWikidata + "]\n";
    styling += "  { color:blue; fill-color:blue; }\n";
    styling += "  /* Blue items have all the items listed in the Name Suggeston Index.*/\n\n";
    styling += "}}";

    OverpassTurboQuery += styling;

    console.log("matchNames is a " + typeof matchNames + ", with a length of " + matchNames.length + ", and contains ...");
    console.log(matchNames);

    console.log("locationSet is a " + typeof locationSet + ", with a length of " + locationSet.length + ", and contains ...");
    console.log(locationSet);
    console.log("== FINISH ===============================================");
    console.log(" ");

//    console.log(JSON.stringify(itemData));
//    console.log("Building Overpass Query...");
//    console.log(OverpassTurboQuery);

//  OverpassTurboQueryURI  = "https://overpass-turbo.eu/?Q="; // Base URL.
    OverpassTurboQueryURI  = "https://tyrasd.github.io/overpass-turbo/?Q="; // Base URL (newer UI).
    OverpassTurboQueryURI += encodeURIComponent(OverpassTurboQuery); // Encoded query.
    OverpassTurboQueryURI += "&R"; // Autorun query upon loading.

    

    return (
      <>
      <p><pre>{OverpassTurboQuery}</pre></p>
      <p><a href={OverpassTurboQueryURI}>Search Overpass Turbo (advance search)</a></p>
      </>
    );
  }