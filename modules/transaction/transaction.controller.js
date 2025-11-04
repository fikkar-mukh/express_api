// GET BALANCE
export const getBalance = async (req, res) => {
  try {
    const { email } = req.user;

    const [rows] = await req.db.query(
      "SELECT balance FROM users WHERE email = ?",
      [email]
    );

    // Jika user tidak ditemukan
    if (rows.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "User tidak ditemukan",
        data: null,
      });
    }

    return res.status(200).json({
      status: 0,
      message: "Get Balance Berhasil",
      data: {
        balance: rows[0].balance,
      },
    });
  } catch (error) {
    console.error("Error getBalance:", error);
    return res.status(500).json({
      status: 500,
      message: "Terjadi kesalahan pada server",
      data: null,
    });
  }
};  

// TOPUP
export const topUpBalance = async (req, res) => {
  try {
    const { email}  = req.user;
    const { top_up_amount } = req.body;

    if (
      top_up_amount === undefined ||
      isNaN(top_up_amount) ||
      Number(top_up_amount) <= 0
    ) {
      return res.status(400).json({
        status: 102,
        message:
          "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
        data: null,
      });
    }

    // Ambil saldo user
    const [userRows] = await req.db.query(
      "SELECT balance FROM users WHERE email = ?",
      [email]
    );

    if (userRows.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "User tidak ditemukan",
        data: null,
      });
    }

    const oldBalance = userRows[0].balance;
    const newBalance = oldBalance + Number(top_up_amount);

    // Update saldo
    await req.db.query("UPDATE users SET balance = ? WHERE email = ?", [
      newBalance,
      email,
    ]);

    // tambah ke tabel transaksi
    await req.db.query(
      "INSERT INTO transactions (email, transaction_type, amount) VALUES (?, ?, ?)",
      [email, "TOPUP", Number(top_up_amount)]
    );

    return res.status(200).json({
      status: 0,
      message: "Top Up Balance berhasil",
      data: {
        balance: newBalance,
      },
    });
  } catch (error) {
    console.error("Error topUpBalance:", error);
    return res.status(500).json({
      status: 500,
      message: "Terjadi kesalahan pada server",
      data: null,
    });
  }
};

// TRANSACTION

// helper untuk generate invoice unik
const generateInvoiceNumber = () => {
  const now = new Date();
  const timestamp = now.getTime();
  return `INV-${timestamp}`;
};

export const makeTransaction = async (req, res) => {
  try {
    const { email } = req.user;
    const { service_code } = req.body;

    if (!service_code) {
      return res.status(400).json({
        status: 102,
        message: "Parameter service_code wajib diisi",
        data: null,
      });
    }

    //ambil data service berdasarkan kode
    const [serviceRows] = await req.db.query(
      "SELECT * FROM services WHERE service_code = ?",
      [service_code]
    );

    if (serviceRows.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Service tidak ditemukan",
        data: null,
      });
    }

    const service = serviceRows[0];

    // ambil saldo user
    const [userRows] = await req.db.query(
      "SELECT balance FROM users WHERE email = ?",
      [email]
    );

    if (userRows.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "User tidak ditemukan",
        data: null,
      });
    }

    const balance = userRows[0].balance;

    // Cek saldo
    if (balance < service.service_tarif) {
      return res.status(400).json({
        status: 103,
        message: "Saldo tidak mencukupi",
        data: null,
      });
    }

    // kurangi saldo user
    const newBalance = balance - service.service_tarif;
    await req.db.query("UPDATE users SET balance = ? WHERE email = ?", [
      newBalance,
      email,
    ]);

    // simpan transaksi ke tabel transactions
    const invoiceNumber = generateInvoiceNumber();
    await req.db.query(
      "INSERT INTO transactions (email, transaction_type, service_code, invoice_number, amount) VALUES (?, ?, ?, ?, ?)",
      [email, "PAYMENT", service_code, invoiceNumber, service.service_tarif]
    );

    return res.status(200).json({
      status: 0,
      message: "Transaksi berhasil",
      data: {
        invoice_number: invoiceNumber,
        service_code: service.service_code,
        service_name: service.service_name,
        transaction_type: "PAYMENT",
        total_amount: service.service_tarif,
        balance: newBalance,
      },
    });
  } catch (error) {
    console.error("Error makeTransaction:", error);
    return res.status(500).json({
      status: 500,
      message: "Terjadi kesalahan pada server",
      data: null,
    });
  }
};

// HISTORY
export const getHistory = async (req, res) => {
  const db = req.db;
  const { email } = req.user;
  const limit = parseInt(req.query.limit) || null;

  try {
    let query = `
      SELECT 
        invoice_number,
        transaction_type,
        CASE 
          WHEN transaction_type = 'TOPUP' THEN 'Top Up balance'
          ELSE s.service_name
        END AS description,
        amount AS total_amount,
        created_at AS created_on
      FROM transactions t
      LEFT JOIN services s ON t.service_code = s.service_code
      WHERE t.email = ?
      ORDER BY t.created_at DESC
    `;

    const params = [email];
    if (limit) {
      query += ` LIMIT ?`;
      params.push(limit);
    }

    const [rows] = await db.query(query, params);

    res.status(200).json({
      status: 0,
      message: "Get History Berhasil",
      data: {
        offset: 0,
        limit: limit || rows.length,
        records: rows,
      },
    });
  } catch (error) {
    console.error("Error getHistory:", error);
    res.status(500).json({
      status: 500,
      message: "Terjadi kesalahan pada server",
      data: null,
    });
  }
};
