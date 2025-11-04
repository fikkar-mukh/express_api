export const getBanners = async (req, res) => {
  try {
    const [rows] = await req.db.query("SELECT banner_name, banner_image, description FROM banners");

    return res.status(200).json({
      status: 0,
      message: "Sukses",
      data: rows,
    });
  } catch (error) {
    console.error("Error getBanners:", error);
    return res.status(500).json({
      status: 500,
      message: "Terjadi kesalahan pada server",
      data: null,
    });
  }
};

export const getServices = async (req, res) => {
  try {
    const [rows] = await req.db.query(
      "SELECT service_code, service_name, service_icon, service_tarif FROM services"
    );

    return res.status(200).json({
      status: 0,
      message: "Sukses",
      data: rows,
    });
  } catch (error) {
    console.error("Error getServices:", error);
    return res.status(500).json({
      status: 500,
      message: "Terjadi kesalahan pada server",
      data: null,
    });
  }
};