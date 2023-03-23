import React from 'react';

const HomePageTable: React.FC<{ name: string }> = ({ name }) => {
  return (
    <div className="">
      {name}
      <h2>
        This will serve as a temporary Status Page. Reference this for
        Development Progress of Modules.
      </h2>
      <br />
      <br />
      <h3>Phase Order Reference:</h3>
      <ul>
        <li>Planning</li>
        <li>Development</li>
        <li>Testing</li>
        <li>Acceptance</li>
      </ul>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Module Name</th>
            <th>Phase</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Customers</td>
            <td>Testing</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Salespersons</td>
            <td>Testing</td>
          </tr>
          <tr>
            <td>3</td>
            <td>FR Certification</td>
            <td>Testing</td>
          </tr>
          <tr>
            <td>4</td>
            <td>Grade Size / Mix</td>
            <td>Testing</td>
          </tr>
          <tr>
            <td>5</td>
            <td>Mixes Raw Material / Used</td>
            <td>Testing</td>
          </tr>
          <tr>
            <td>6</td>
            <td>Orders / Production Data / Weights to Ship Out</td>
            <td>Testing</td>
          </tr>
          <tr>
            <td>7</td>
            <td>Credit Memo</td>
            <td>Not Started</td>
          </tr>
          <tr>
            <td>8</td>
            <td>Reporting</td>
            <td>Not Started</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default HomePageTable;
