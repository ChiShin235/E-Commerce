import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { vnpayAPI } from "../../src/services/api";

const buildParams = (paramString) => {
  const params = {};
  const search = new URLSearchParams(paramString);
  search.forEach((value, key) => {
    params[key] = value;
  });
  return params;
};

const VnpayReturn = () => {
  const [searchParams] = useSearchParams();
  const paramString = searchParams.toString();
  const params = useMemo(() => buildParams(paramString), [paramString]);
  const hasParams = paramString.length > 0;
  const [state, setState] = useState({
    loading: true,
    error: null,
    data: null,
  });

  useEffect(() => {
    if (!hasParams) {
      setState({
        loading: false,
        error: "Thiếu tham số trả về từ VNPay.",
        data: null,
      });
      return;
    }

    let isActive = true;
    vnpayAPI
      .verifyReturn(params)
      .then((data) => {
        if (!isActive) return;
        setState({ loading: false, error: null, data });
      })
      .catch((error) => {
        if (!isActive) return;
        const message =
          error.response?.data?.message || "Không thể xác minh giao dịch.";
        setState({ loading: false, error: message, data: null });
      });

    return () => {
      isActive = false;
    };
  }, [hasParams, params]);

  const isSuccess = state.data?.isVerified && state.data?.isSuccess;
  const title = state.loading
    ? "Đang xác minh giao dịch..."
    : state.error
    ? "Xác minh giao dịch thất bại"
    : isSuccess
    ? "Thanh toán thành công"
    : "Thanh toán chưa thành công";

  return (
    <div className="min-h-[70vh] bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-xl bg-white p-8 shadow">
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>

          {state.loading && (
            <p className="mt-4 text-gray-600">
              Vui lòng chờ trong giây lát để hệ thống xác minh giao dịch.
            </p>
          )}

          {state.error && (
            <p className="mt-4 text-red-600">{state.error}</p>
          )}

          {!state.loading && !state.error && (
            <div className="mt-4 space-y-2 text-gray-700">
              <p>{state.data?.message || "Giao dịch đã được xử lý."}</p>
              {state.data?.orderId && (
                <p>
                  Mã đơn hàng:{" "}
                  <span className="font-medium">{state.data.orderId}</span>
                </p>
              )}
              <p>
                Trạng thái xác minh:{" "}
                <span className="font-medium">
                  {state.data?.isVerified ? "Hợp lệ" : "Không hợp lệ"}
                </span>
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {isSuccess ? (
              <Link
                to="/order"
                className="rounded-lg bg-black px-5 py-2 text-white"
              >
                Xem đơn hàng
              </Link>
            ) : (
              <Link
                to="/cart"
                className="rounded-lg bg-black px-5 py-2 text-white"
              >
                Quay lại giỏ hàng
              </Link>
            )}
            <Link
              to="/"
              className="rounded-lg border border-gray-300 px-5 py-2 text-gray-700"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VnpayReturn;
