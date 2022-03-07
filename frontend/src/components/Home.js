import React from 'react';
import UserDatatable from './userdatatable1';
import { useCookies } from 'react-cookie';

function Home() {
  const [cookies, setCookie] = useCookies();
  return (
    <div className="container">
      <div className="row my-4">
        <div className="col-md-10 offset-md-1">
          {
            cookies.usertype == "user" ?
              <>
                <h3 className="text-center">All book requests</h3>
                <UserDatatable />
              </>
            :
            <h3 className="text-center">All book requests</h3>
          }
        </div>
      </div>
    </div>
  );
}

export default Home;
