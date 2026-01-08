import {
  Box,
  Grid,
  Typography,
  Card,
  CardActionArea,
  CardMedia,
} from '@mui/material';
import {
  colorSub1Letter,
  typeFormFiles,
  typeFormNote,
  typePages,
} from '../Constain';

function openNewTab({ htmlFile }) {
  // Thay vì mở tab mới, cập nhật URL của tab hiện tại
  window.location.href = `/${htmlFile}`; // Đổi đường dẫn của tab hiện tại sang file HTML
}
// export function openNewTab({ nameForm, htmlFile }) {
//   // Tạo tab mới và mở file HTML từ thư mục public
//   const newWindow = window.open(`/${htmlFile}`);

//   // Thêm thông tin vào title cửa sổ mới (tuỳ chọn)
//   newWindow.document.title = nameForm;
// }
export default function Forms({ inits }) {
  const pages = JSON.parse(inits.find((item) => item.type === typePages).data);
  const formNote = inits.find((item) => item.type === typeFormNote).data;
  const formFiles = JSON.parse(
    inits.find((item) => item.type === typeFormFiles).data
  );
  return (
    <Box sx={{ mb: 6 }}>
      {/* TITLE */}
      {pages && pages.length > 0 && (
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            mb: 2,
            borderBottom: '2px solid #ccc',
            pb: 1,
          }}
        >
          {pages[pages.length - 1].sub[1]}
        </Typography>
      )}

      {/* DESCRIPTION */}
      {formNote && (
        <Typography
          sx={{ mb: 4, mx: { xs: 0, md: 3, lg: 6 }, fontSize: 'larger' }}
          dangerouslySetInnerHTML={{ __html: formNote.replace(/[\\"]/g, '') }}
        />
      )}

      {/* GRID OF FORMS */}
      <Grid container spacing={4}>
        {formFiles &&
          formFiles.length > 0 &&
          formFiles.map((item, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              key={index}
              component="a"
              sx={{ cursor: 'pointer' }}
              onClick={(e) => {
                e.preventDefault(); // chặn truy cập link thật
                openNewTab({
                  // nameForm: item.title,
                  htmlFile: item.htmlFile,
                });
              }}
            >
              <Card
                sx={{
                  boxShadow: 3,
                  borderRadius: 2,
                  backgroundColor: 'transparent',
                }}
              >
                <CardActionArea
                  sx={{ p: 2, display: 'flex', alignItems: 'center' }}
                >
                  <CardMedia
                    component="img"
                    image={item.img}
                    alt={item.title}
                    sx={{
                      width: 100,
                      height: 100,
                      objectFit: 'contain',
                      border: '1px solid #ccc',
                      backgroundColor: 'white',
                    }}
                  />
                  {/* <PdfViewer name={`${item.title}.pdf`} form={true} /> */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      color: colorSub1Letter,
                      textDecoration: 'none',
                      ml: 3,
                    }}
                  >
                    {item.title}
                  </Typography>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
}
