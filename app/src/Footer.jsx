import React from 'react';

export default function Footer(props) {
  const index = props.index;
  const meta = index && index.meta;
  console.log("# # # # # #Footer Start:");
  console.log(meta);
  console.log("# # # # # #Footer End.");
  const version = meta && meta.version;
  const generated = meta && meta.generated;
  const display = generated && version && `NSI v${version} (${generated})`;
  return (
    <div id='footer'>{display}</div>
  );
};
