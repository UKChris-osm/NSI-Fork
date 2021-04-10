import React from 'react';

export default function Footer(props) {
  const index = props.index;
  const meta = index && index.meta;
  console.log("# # # # # #Footer Start:");
  console.log(meta);
  console.log("# # # # # #Footer End.");
  const version = meta && meta.version;
  const generated = meta && meta.generated;
  const released = generated && new Date(Date.parse(generated));
  const display = released && version && `NSI v${version} (Generated: ${released})`;
  return (
    <div id='footer'>{display}</div>
  );
};
