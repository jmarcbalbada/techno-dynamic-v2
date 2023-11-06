import { RichTextReadOnly } from 'mui-tiptap';

import useTiptapExtensions from '../../hooks/useTiptapExtensions';

import { Box } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// TODO: add editable course details
const courseDetails =
  '<h2>Technopreneurship</h2><p></p><p><strong>Technopreneurship (ES038)</strong> is a course mandated by Commission on Higher Education (CHED) to foster innovation among the Filipino youth. It aims to produce students who are not only well-versed in engineering-turning skills and knowledge into science and technology products, but also entrepreneurs who can create more jobs and contribute to the national economy. CIT University is currently offering Technopreneurship in three colleges namely the College of Engineering and Architecture, College of Computer Studies, and College of Management, Business and Accountancy.</p><p></p><p>This course is mainly based on <strong>Disciplined Entrepreneurship</strong> by <strong>Bill Aulet</strong> which provides a 24-step guide on how to efficiently bring products to market by giving emphasis on the real end-user needs. Following this customer-centric approach, your journey in ES038 will also revolve around <strong>customer discovery</strong>-putting end-user needs at the center of an iterative product/solution development.</p><p></p><p>ES038 is guided by the following <strong>Intended Learning Outcomes</strong>:</p><p></p><ul><li><p>Develop sound knowledge and understanding of entrepreneurship and innovation.</p></li><li><p>Demonstrate critical thinking and systems analysis skills to identify, evaluate and communicate strategic and functional issues associated with invention and commercialization.</p></li><li><p>Apply communication, interpersonal, and team skills necessary in business practice.</p></li></ul><p></p><p>Through the university business incubator, <strong>Wildcat Innovation Labs (WIL)</strong>, these learning outcomes are complemented by a series of events and activities in <strong>WildFest</strong> to gather real-world problems, validate solutions and promote innovations.</p><p></p><p>Watch this video of Engr. Ralph Laviste, WIL Manager, to know more about Wildcat Innovation Labs.</p><div data-youtube-video=""><iframe width="480" height="320" allowfullscreen="true" autoplay="false" disablekbcontrols="true" enableiframeapi="false" endtime="0" ivloadpolicy="0" loop="false" modestbranding="false" origin="" playlist="" src="https://www.youtube.com/embed/pOUJXDKmEVU?disablekb=1" start="0"></iframe></div>';

const CourseDetails = () => {
  const extensions = useTiptapExtensions();
  return (
    <Accordion
      variant='outlined'
      TransitionProps={{ unmountOnExit: true }}
      sx={{
        boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'
      }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant='h5'>Course Details</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box
          borderRadius={3}
          border='1px dashed #ccc'
          sx={{
            // TODO: add better bg color
            p: 2
          }}>
          <RichTextReadOnly content={courseDetails} extensions={extensions} />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default CourseDetails;
