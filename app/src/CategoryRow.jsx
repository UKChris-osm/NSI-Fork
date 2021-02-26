import React from 'react';
import { Link } from 'react-router-dom';

import CategoryRowSocialLinks from './CategoryRowSocialLinks';

export default function CategoryRow(props) {
  const data = props.data;
  if (data.isLoading()) return;

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
        { buildOverpassTurbo("brand",item,k,v) }
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
    return (<a target='_blank' href={href} title={title}>Search Overpass Turbo</a>);
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

  function buildOverpassTurbo(primaryData,itemData,k,v) {
    let locationSet           = itemData.locationSet.include;
    let matchNames            = "";
    let name                  = "";
    let brand                 = "";
    let brandWikidata         = "";
    let styling               = "";
    let searchArea            = "";
    let OverpassTurboQueryURI = "";
    let OverpassTurboQuery    = "[out:json][timeout:100];\n"

    // Build a basic location search if locationSet isn't set to world (001).
    if (locationSet != "001") {
      searchArea = "(area.searchArea)";
      OverpassTurboQuery += "(\n";

      let i;
      for (i=0; i<locationSet.length; i++)
        OverpassTurboQuery += "  {{geocodeArea:" + locationSet[i] + "}};\n";

      OverpassTurboQuery += ")->.searchArea;\n  (\n";
//      OverpassTurboQuery += locationSet + ";\n";
    }

    // Include any 'matchNames' as a name search.
    if (itemData.matchNames) {
      matchNames = itemData.matchNames;

      let i;
      for (i=0; i<locationSet.length; i++)
        OverpassTurboQuery += "  nwr[\"name\"=\"" + matchNames[i] + "\"]\n // This is a matchName.";
    } else {
	matchNames = "none set";
    }

    if (itemData.tags.name)
	name = itemData.tags.name;
    else
	name = "none set";

    if (itemData.tags.brand)
	brand = itemData.tags.brand;
    else
	brand = "none set";

    if (itemData.tags['brand:wikidata'])
	brandWikidata = itemData.tags['brand:wikidata'];
    else
	brandWikidata = "none set";


    if (name != "none set")
      OverpassTurboQuery += "  nwr[\"name\"=\"" + name + "\"]" + searchArea + ";\n";
    if (brand != "none set")
      OverpassTurboQuery += "  nwr[\"brand\"=\"" + brand + "\"]" + searchArea + ";\n";

    OverpassTurboQuery += "  )\nout body;\n>;\nout skel qt;\n\n";

    styling += "{{style:\n";
    styling += "  node[name=" + name + "],\n";
    styling += "  way[name=" + name + "],\n";
    styling += "  relation[name=" + name + "]\n";
    styling += "  { color:red; fill-color:red; }\n\n";
    styling += "  node[" + k + "=" + v + "][name=" + name + "],\n";
    styling += "  way[" + k + "=" + v + "][name=" + name + "],\n";
    styling += "  relation[" + k + "=" + v + "][name=" + name + "]\n";
    styling += "  { color:yellow; fill-color:yellow; }\n\n";
    styling += "  node[" + k + "=" + v + "][name=" + name + "][brand=" + brand + "][brand:wikidata=" + brandWikidata + "],\n";
    styling += "  way[" + k + "=" + v + "][name=" + name + "][brand=" + brand + "][brand:wikidata=" + brandWikidata + "],\n";
    styling += "  relation[" + k + "=" + v + "][name=" + name + "][brand=" + brand + "][brand:wikidata=" + brandWikidata + "]\n";
    styling += "  { color:green; fill-color:green; }\n";
    styling += "}}";

    OverpassTurboQuery += styling;

    console.log(matchNames);
    console.log(matchNames.length);
    console.log("matchNames is a " + typeof matchNames);
    console.log("locationSet is a " + typeof locationSet);
    console.log(locationSet.length);
    console.log(JSON.stringify(itemData));
    console.log("Building Overpass Query...");
    console.log(OverpassTurboQuery);

    OverpassTurboQueryURI  = "https://overpass-turbo.eu/?Q=" 
    OverpassTurboQueryURI += encodeURIComponent(OverpassTurboQuery);
    OverpassTurboQueryURI += "&R";

    

    return (
      <>
      <p><pre>{OverpassTurboQuery}</pre></p>
      <p><a href={OverpassTurboQueryURI}>Try query</a></p>
      </>
    );
  }