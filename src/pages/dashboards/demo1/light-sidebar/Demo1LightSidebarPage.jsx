import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/container';
import { Toolbar, ToolbarActions, ToolbarHeading } from '@/layouts/demo1/toolbar';
import { Demo1LightSidebarContent } from './';
const Demo1LightSidebarPage = () => {
  return <Fragment>
      {/* <Container>
        <Toolbar>
          <ToolbarHeading title="Dashboard" description="Central Hub for Personal Customization" />
          <ToolbarActions>
            <Link to="/" className="btn btn-sm btn-light">
              View Profpublic-profile/profiles/defaultile
            </Link>
          </ToolbarActions>
        </Toolbar>
      </Container>

      <Container>
        <Demo1LightSidebarContent />
      </Container> */}
    </Fragment>;
};
export { Demo1LightSidebarPage };