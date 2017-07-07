import React from 'react';
import ***REMOVED*** Route, Link ***REMOVED*** from 'react-router-dom';
import ***REMOVED*** Breadcrumb, BreadcrumbItem ***REMOVED*** from 'reactstrap';
import routes from '../../routes';

const findRouteName = url => routes[url];

const getPaths = (pathname) => ***REMOVED***
  const paths = ['/'];

  if (pathname === '/') return paths;

  pathname.split('/').reduce((prev, curr, index) => ***REMOVED***
    const currPath = `$***REMOVED***prev***REMOVED***/$***REMOVED***curr***REMOVED***`;
    paths.push(currPath);
    return currPath;
  ***REMOVED***);
  console.log(paths);
  return paths;
***REMOVED***;

const BreadcrumbsItem = (***REMOVED*** ...rest, match ***REMOVED***) => ***REMOVED***
  const routeName = findRouteName(match.url);
  if (routeName) ***REMOVED***
    return (
      match.isExact ?
      (
        <BreadcrumbItem active>***REMOVED***routeName***REMOVED***</BreadcrumbItem>
      ) :
      (
        <BreadcrumbItem>
          <Link to=***REMOVED***match.url || ''***REMOVED***>
            ***REMOVED***routeName***REMOVED***
          </Link>
        </BreadcrumbItem>
      )
    );
  ***REMOVED***
  return null;
***REMOVED***;

const Breadcrumbs = (***REMOVED*** ...rest, location : ***REMOVED*** pathname ***REMOVED***, match ***REMOVED***) => ***REMOVED***
  const paths = getPaths(pathname);
  const i = 0;
  const items = paths.map((path, i) => <Route key=***REMOVED***i++***REMOVED*** path=***REMOVED***path***REMOVED*** component=***REMOVED***BreadcrumbsItem***REMOVED*** />);
  return (
    <Breadcrumb>
      ***REMOVED***items***REMOVED***
    </Breadcrumb>
  );
***REMOVED***;

export default props => (
  <div>
    <Route path="/:path" component=***REMOVED***Breadcrumbs***REMOVED*** ***REMOVED***...props***REMOVED*** />
  </div>
);
