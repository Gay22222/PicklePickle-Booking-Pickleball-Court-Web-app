import jwt from "jsonwebtoken";
import { User } from "../../models/user.model.js";
import { config } from "../../config/env.js";
import { hashPassword, verifyPassword } from "../../shared/utils/password.js";
import { sendVerificationEmail } from "../../shared/email/emailClient.js";

function generateOtp() {
    return String(Math.floor(100000 + Math.random() * 900000));
}

function toSafeUser(user) {
    if (!user) return null;
    return {
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        emailVerified: user.emailVerified,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}

function signToken(user) {
    const payload = {
        sub: user._id.toString(),
        fullName: user.fullName,
        emailVerified: user.emailVerified,
    };

    const token = jwt.sign(payload, config.jwtSecret, {
        expiresIn: "1d",
    });

    return token;
}

// ========== REGISTER ==========
export async function registerUser(input) {
    const { fullName, email, phone, password } = input;

    if (!fullName || !email || !password) {
        throw new Error("fullName, email và password là bắt buộc");
    }

    const existingByEmail = await User.findOne({ email });
    if (existingByEmail) {
        throw new Error("Email đã được sử dụng");
    }

    if (phone) {
        const existingByPhone = await User.findOne({ phone });
        if (existingByPhone) {
            throw new Error("Số điện thoại đã được sử dụng");
        }
    }

    const passwordHash = await hashPassword(password);

    const otp = generateOtp();
    const expires = new Date(Date.now() + 5 * 60 * 1000);

    const user = await User.create({
        fullName,
        email,
        phone: phone || null,
        passwordHash,
        emailVerified: false,
        emailVerificationCode: otp,
        emailVerificationExpiresAt: expires,
        isActive: true,
    });

    try {
        await sendVerificationEmail(email, otp);
    } catch (err) {
        console.error("[Auth] sendVerificationEmail error:", err.message);
    }

    const safeUser = toSafeUser(user);
    const payload = { user: safeUser };

    if (config.nodeEnv === "development") {
        payload.debugOtp = otp;
    }

    return payload;
}

// ========== VERIFY EMAIL ==========
export async function verifyEmail(input) {
    const { email, code } = input;

    const user = await User.findOne({ email });
    if (!user) throw new Error("Không tìm thấy tài khoản");

    if (!user.emailVerificationCode || !user.emailVerificationExpiresAt) {
        throw new Error("Không có mã OTP, vui lòng yêu cầu gửi lại");
    }

    const now = new Date();
    if (user.emailVerificationExpiresAt < now) {
        throw new Error("Mã OTP đã hết hạn");
    }

    if (user.emailVerificationCode !== code) {
        throw new Error("Mã OTP không chính xác");
    }

    user.emailVerified = true;
    user.emailVerificationCode = null;
    user.emailVerificationExpiresAt = null;
    await user.save();

    const safeUser = toSafeUser(user);
    const token = signToken(user);

    return { user: safeUser, token };
}

// ========== RESEND EMAIL OTP ==========
export async function resendEmailOtp(input) {
    const { email } = input;

    const user = await User.findOne({ email });
    if (!user) throw new Error("Không tìm thấy tài khoản");

    if (user.emailVerified) {
        throw new Error("Email đã được xác minh");
    }

    const otp = generateOtp();
    const expires = new Date(Date.now() + 5 * 60 * 1000);

    user.emailVerificationCode = otp;
    user.emailVerificationExpiresAt = expires;
    await user.save();

    try {
        await sendVerificationEmail(email, otp);
    } catch (err) {
        console.error("[Auth] resendEmailOtp error:", err.message);
    }

    const safeUser = toSafeUser(user);
    const payload = { user: safeUser };

    if (config.nodeEnv === "development") {
        payload.debugOtp = otp;
    }

    return payload;
}

// ========== LOGIN ==========
export async function loginUser(input) {
    const { identifier, password } = input;

    if (!identifier || !password) {
        throw new Error("Thiếu thông tin đăng nhập");
    }

    const user = await User.findOne({
        $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) throw new Error("Sai thông tin đăng nhập");
    if (!user.isActive) throw new Error("Tài khoản đã bị khóa");

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) throw new Error("Sai thông tin đăng nhập");

    if (!user.emailVerified) {
        throw new Error("Email chưa được xác minh");
    }

    user.lastLoginAt = new Date();
    await user.save();

    const safeUser = toSafeUser(user);
    const token = signToken(user);

    return { user: safeUser, token };
}
