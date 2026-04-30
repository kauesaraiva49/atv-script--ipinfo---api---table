const ipJson = [];
const btnGetIp = document.querySelector('#btnGetIp');
const inputIpAddress = document.querySelector('#inputIpAddress');
const ipTable = document.querySelector('#ipTable');

btnGetIp.addEventListener('click', () => addIp());
inputIpAddress.addEventListener('keypress', (e) => {
  if (e.keyCode === 13) addIp();
});

function addIp() {
  const ipAddress = inputIpAddress.value.trim();

  if (!ipAddress) {
    document.querySelector('#alert-info').innerHTML = `
      <div class="alert alert-warning alert-dismissible fade show" role="alert">
        <strong>Opa!</strong> Você não inseriu um IP válido.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>`;
    return;
  }

  if (ipJson.length === 0) {
    document.querySelector('.tabela').style.display = 'block';
    ipTable.innerHTML = `
      <thead>
        <tr>
          <th>IP</th><th>Organização</th><th>País</th><th>Cidade</th><th>Remover</th>
        </tr>
      </thead>
      <tbody></tbody>`;
  }

  if (!ipJson.some((item) => item.ip === ipAddress)) {
    const url = `https://ipinfo.io/${ipAddress}/json?token=ea38c5437881ca`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const { ip, city = '-', country = '-', org = '-' } = data;
        const orgName = org.includes(' ') ? org.split(' ').slice(1).join(' ') : org;
        const ipInfo = {
          ip,
          city,
          country,
          org: orgName,
          close: `<i class="fa fa-times" style="font-size: 22px;"></i>`
        };
        ipJson.push(ipInfo);
        renderTable();
      });
  }
}

function renderTable() {
  const tableBody = document.querySelector('tbody');
  tableBody.innerHTML = ipJson
    .map((item) => `
      <tr>
        <td>${item.ip}</td>
        <td>${item.org}</td>
        <td>${item.country}</td>
        <td>${item.city}</td>
        <td><a href="#">${item.close}</a></td>
      </tr>`)
    .join('');

  document.querySelectorAll('i').forEach((icon, index) => {
    icon.addEventListener('click', () => {
      ipJson.splice(index, 1);
      renderTable();
    });
  });
}
