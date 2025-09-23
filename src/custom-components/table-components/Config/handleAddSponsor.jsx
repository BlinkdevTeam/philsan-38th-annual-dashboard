export const handleAddSponsor = (setToAddSponsor) => (e) => {
  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
  };

  const value = e.target.value;

  setToAddSponsor((prev) => ({
    ...prev,
    sponsor_name: value,
    password: value ? `${generateRandomCode()}-${value}` : null,
  }));
};
