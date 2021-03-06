import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';


export default function Filters(props) {
  const filters = props.data.filters;
  const setFilters = props.data.setFilters;

  const tt = filters.tt || '';
  const cc = filters.cc || '';
  const inc = !!filters.inc;
  const klass = 'filters' + ((tt.trim() || cc.trim() || inc) ? ' active' : '');

  return (
    <div className={klass}>

    <span className='icon'><FontAwesomeIcon icon={faFilter} /></span>
    <span className='filterby'>Filter by</span>

    <span className='field'>
      <label for='tt'>Tag Text:</label>
      <input type='text' id='tt' name='tt' autocorrect='off' size='15'
        value={tt} onChange={filtersChanged} />
    </span>

    <span className='field'>
      <label for='cc'>Country Code:</label>
      <input type='text' id='cc' name='cc' list='geojsonlist' autocorrect='off' maxlength='50' size='20'
        value={cc} onChange={filtersChanged} />
      <datalist id='geojsonlist'>
        <option value='au-act.geojson'/>
        <option value='au-nsw.geojson'/>
        <option value='au-nt.geojson'/>
        <option value='au-qld.geojson'/>
        <option value='au-sa.geojson'/>
        <option value='au-vic.geojson'/>
        <option value='au-wa.geojson'/>
        <option value='gb-south-west.geojson'>South West of England</option>
      </datalist>
    </span>

    <span className='field'>
      <label for='inc'>Incomplete:</label>
      <input type='checkbox' id='inc' name='inc'
        checked={inc} onChange={filtersChanged} />
    </span>

    <span className='field'>
      <button className='clearFilters' name='clearFilters'
        onClick={clearFilters}>Clear</button>
    </span>

    </div>
  );


  function filtersChanged(event) {
    let f = Object.assign({}, filters);  // shallow copy

    let val;
    if (event.target.type === 'checkbox') {
      val = event.target.checked;
    } else {
      val = (event.target.value || '');
    }

    if (val) {
      f[event.target.name] = val;
    } else {
      delete f[event.target.name];
    }
    setFilters(f);
  }


  function clearFilters(event) {
    event.preventDefault();
    event.target.blur();
    setFilters({});
  }

};
