// student page - render

<ScrollView nestedScrollEnabled={true} contentContainerStyle={{flexGrow: 1}}>
  {/* кнопка удаления */}
  {this.state.editing && this.state.options.type == 'view' ? (
    <TouchableOpacity
      style={Styles.cardStudentBtn_delete}
      onPress={() => this.removeStudentConfirm()}>
      <Icons.Feather
        name="trash"
        size={16}
        color="#DC5F5A"
        style={{marginRight: 8}}
      />
      <Text style={Styles.cardDaysRemoveText}>Удалить</Text>
    </TouchableOpacity>
  ) : null}
  {/* Фамилия */}
  <View
    style={
      this.state.editing ? Styles.cardDefaultRow_edit : Styles.cardDefaultRow
    }>
    <Text style={Styles.cardDefaultLabel}>
      Фамилия{this.state.editing ? ' *' : null}
    </Text>
    {this.state.editing ? (
      <TextInput
        style={Styles.inputDefault}
        value={this.state.currentDataClient.Surname}
        onChangeText={val =>
          this.setState({
            currentDataClient: {
              ...this.state.currentDataClient,
              Surname: val,
            },
          })
        }
      />
    ) : (
      <Text style={Styles.inputDefault_disabled}>
        {this.state.currentDataClient.Surname}
      </Text>
    )}
  </View>
  {/* имя */}
  <View
    style={
      this.state.editing ? Styles.cardDefaultRow_edit : Styles.cardDefaultRow
    }>
    <Text style={Styles.cardDefaultLabel}>
      Имя{this.state.editing ? ' *' : null}
    </Text>
    {this.state.editing ? (
      <TextInput
        style={Styles.inputDefault}
        value={this.state.currentDataClient.Name}
        onChangeText={val =>
          this.setState({
            currentDataClient: {
              ...this.state.currentDataClient,
              Name: val,
            },
          })
        }
      />
    ) : (
      <Text style={Styles.inputDefault_disabled}>
        {this.state.currentDataClient.Name}
      </Text>
    )}
  </View>
  {/* отчество */}
  <View
    style={
      this.state.editing ? Styles.cardDefaultRow_edit : Styles.cardDefaultRow
    }>
    <Text style={Styles.cardDefaultLabel}>Отчество</Text>
    {this.state.editing ? (
      <TextInput
        style={Styles.inputDefault}
        value={this.state.currentDataClient.Midname}
        onChangeText={val =>
          this.setState({
            currentDataClient: {
              ...this.state.currentDataClient,
              Midname: val,
            },
          })
        }
      />
    ) : (
      <Text style={Styles.inputDefault_disabled}>
        {this.state.currentDataClient.Midname || 'Не указано'}
      </Text>
    )}
  </View>
  {/* дата рождения */}
  <View
    style={
      this.state.editing ? Styles.cardDefaultRow_edit : Styles.cardDefaultRow
    }>
    <Text style={Styles.cardDefaultLabel}>
      {this.state.editing ? 'Дата рождения *' : 'Возраст'}
    </Text>
    {this.state.editing ? (
      <TouchableOpacity
        style={{...Styles.formDataTime, marginTop: 6}}
        onPress={() => this.setState({timePickerOpen: true})}>
        <Text style={Styles.formDataTimeText}>{this.formatDateBD()}</Text>
      </TouchableOpacity>
    ) : (
      <Text style={Styles.cardStudentValue}>
        {this.state.clientAge != 0 ? this.state.clientAge : 'Не указано'}
      </Text>
    )}
  </View>
  {/* группа в организации */}
  <View
    style={
      this.state.editing ? Styles.cardDefaultRow_edit : Styles.cardDefaultRow
    }>
    <Text style={Styles.cardDefaultLabel}>
      Группа в организации{this.state.editing ? ' *' : null}
    </Text>
    {this.state.editing ? (
      <TextInput
        style={Styles.inputDefault}
        value={this.state.currentDataClient.Group_name}
        onChangeText={val =>
          this.setState({
            currentDataClient: {
              ...this.state.currentDataClient,
              Group_name: val,
            },
          })
        }
      />
    ) : (
      <Text style={Styles.inputDefault_disabled}>
        {this.state.currentDataClient.Group_name}
      </Text>
    )}
  </View>
  {/* возрастная группа */}
  <View
    style={
      this.state.editing ? Styles.cardDefaultRow_edit : Styles.cardDefaultRow
    }>
    <Text style={Styles.cardDefaultLabel}>
      Возрастная группа{this.state.editing ? ' *' : null}
    </Text>
    {this.state.editing ? (
      <DropDownPicker
        zIndex={12}
        open={this.state.dropDownsOpen.categori}
        value={this.state.currentDataClient.Categori_id}
        items={this.state.categories}
        setOpen={val =>
          this.setState({
            dropDownsOpen: {...this.state.dropDownsOpen, categori: val},
          })
        }
        setValue={callback =>
          this.setState(state => ({
            currentDataClient: {
              ...this.state.currentDataClient,
              Categori_id: callback(state.value),
            },
          }))
        }
        setItems={callback =>
          this.setState(state => ({categories: callback(state.items)}))
        }
        listMode="SCROLLVIEW"
        style={Styles.dropDown}
        dropDownContainerStyle={Styles.dropDownBox}
        disabled={!this.state.editing}
      />
    ) : (
      <Text
        style={
          this.state.currentDataClient.Categori_id != null &&
          this.state.categories.length > 0
            ? Styles.cardStudentValue
            : Styles.cardStudentValue_empty
        }>
        {this.state.currentDataClient.Categori_id != null &&
        this.state.categories.length > 0
          ? this.state.categories.filter(
              item => item.value == this.state.currentDataClient.Categori_id,
            )[0].label
          : 'Не выбранно'}
      </Text>
    )}
  </View>
  {/* группа */}
  <View
    style={
      this.state.editing ? Styles.cardDefaultRow_edit : Styles.cardDefaultRow
    }>
    <Text style={Styles.cardDefaultLabel}>Группа</Text>
    {this.state.editing ? (
      <DropDownPicker
        zIndex={11}
        open={this.state.dropDownsOpen.subgroup}
        value={this.state.currentDataClient.Subgroup_id}
        items={this.state.subGroups}
        setOpen={val =>
          this.setState({
            dropDownsOpen: {...this.state.dropDownsOpen, subgroup: val},
          })
        }
        setValue={callback =>
          this.setState(state => ({
            currentDataClient: {
              ...this.state.currentDataClient,
              Subgroup_id: callback(state.value),
            },
          }))
        }
        setItems={callback =>
          this.setState(state => ({subGroups: callback(state.items)}))
        }
        listMode="SCROLLVIEW"
        style={Styles.dropDown}
        dropDownContainerStyle={Styles.dropDownBox}
      />
    ) : (
      <Text
        style={
          this.state.currentDataClient.Subgroup_id != null &&
          this.state.subGroups.length > 0
            ? Styles.cardStudentValue
            : Styles.cardStudentValue_empty
        }>
        {this.state.currentDataClient.Subgroup_id != null &&
        this.state.subGroups.length > 0
          ? this.state.subGroups.filter(
              item => item.value == this.state.currentDataClient.Subgroup_id,
            )[0].label
          : 'Не выбранно'}
      </Text>
    )}
  </View>
  {/* ЦПМПК */}
  <View
    style={
      this.state.editing ? Styles.cardDefaultRow_edit : Styles.cardDefaultRow
    }>
    <Text style={Styles.cardDefaultLabel}>
      Заключение ЦПМПК{this.state.editing ? ' *' : null}
    </Text>
    {this.state.editing ? (
      <DropDownPicker
        zIndex={10}
        open={this.state.dropDownsOpen.diagnos}
        value={this.state.currentDataClient.Diagnos_id}
        items={this.state.diagnosis}
        setOpen={val =>
          this.setState({
            dropDownsOpen: {...this.state.dropDownsOpen, diagnos: val},
          })
        }
        setValue={callback =>
          this.setState(state => ({
            currentDataClient: {
              ...this.state.currentDataClient,
              Diagnos_id: callback(state.value),
            },
          }))
        }
        setItems={callback =>
          this.setState(state => ({diagnosis: callback(state.items)}))
        }
        listMode="SCROLLVIEW"
        style={Styles.dropDown}
        dropDownContainerStyle={Styles.dropDownBox}
      />
    ) : (
      <Text
        style={
          this.state.currentDataClient.Diagnos_id != null &&
          this.state.diagnosis.length > 0
            ? Styles.cardStudentValue
            : Styles.cardStudentValue_empty
        }>
        {this.state.currentDataClient.Diagnos_id != null &&
        this.state.diagnosis.length > 0
          ? this.state.diagnosis.filter(
              item => item.value == this.state.currentDataClient.Diagnos_id,
            )[0].label
          : 'Не выбранно'}
      </Text>
    )}
  </View>
  {/* заключение логопеда */}
  <View
    style={
      this.state.editing || this.state.checkedViolations.length != 0
        ? Styles.cardDefaultRow_edit
        : {...Styles.cardDefaultRow, marginBottom: 25}
    }>
    <Text style={Styles.cardDefaultLabel}>Заключение логопеда</Text>
    {this.state.checkedViolations.length == 0 && !this.state.editing ? (
      <Text style={Styles.cardStudentValue_empty}>Не выбранно</Text>
    ) : (
      <View style={Styles.cardStudentBox}>
        {this.state.editing
          ? this.state.violations.map(item => (
              <Text
                key={item.value}
                style={
                  this.state.checkedViolations.includes(item.value.toString())
                    ? Styles.cardStudentElement_active
                    : Styles.cardStudentElement
                }
                onPress={() => this.violationSelected(item.value.toString())}>
                {item.label}
              </Text>
            ))
          : this.state.violations
              .filter(item =>
                this.state.checkedViolations.includes(item.value.toString()),
              )
              .map(item => (
                <Text key={item.value} style={Styles.cardStudentElement}>
                  {item.label}
                </Text>
              ))}
      </View>
    )}
  </View>
  {/* блок симптоматики */}
  <View style={Styles.cardStudentLine}></View>
  {this.state.currentSymptoms ? (
    <SymptomsForm
      currentSymptoms={this.state.currentSymptoms}
      mode={this.state.editing}
      onCallBack={newSympt => this.symptomsSelected(newSympt)}
    />
  ) : null}
  {/* блок таблицы звуков */}
  <View style={Styles.cardStudentLine}></View>
  {this.state.currentSounds ? (
    <TableSounds
      currentSounds={this.state.currentSounds}
      mode={this.state.editing}
      onCallBack={newSound => this.soundsSelected(newSound)}
    />
  ) : null}
  <View style={Styles.cardStudentLine}></View>
  {/* заметки */}
  <View style={{...Styles.cardDefaultRow_edit, marginBottom: 100}}>
    <Text style={Styles.cardStudentTitle}>Заметки</Text>
    {this.state.editing ? (
      <TextInput
        multiline={true}
        numberOfLines={5}
        value={this.state.currentDataClient.Note}
        onChangeText={val =>
          this.setState({
            currentDataClient: {
              ...this.state.currentDataClient,
              Note: val,
            },
          })
        }
        style={Styles.cardStudentNote_edit}
        editable={this.state.editing}
      />
    ) : this.state.currentDataClient.Note ? (
      <Text style={Styles.cardStudentNoteText}>
        {this.state.currentDataClient.Note}
      </Text>
    ) : (
      <Text
        style={{
          ...Styles.cardStudentValue_empty,
          marginBottom: 25,
          marginLeft: 0,
        }}>
        Пусто
      </Text>
    )}
  </View>
  {/* пустое пространство */}
  <View style={Styles.crutch}></View>
</ScrollView>;
{
  this.state.timePickerOpen ? (
    <DateTimePicker
      maximumDate={new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000)}
      minimumDate={new Date(Date.now() - 9 * 365 * 24 * 60 * 60 * 1000)}
      value={this.state.timePickerDate}
      mode={'date'}
      is24Hour={true}
      onChange={(_, val) => this.updateDateBD(val)}
    />
  ) : null;
}
